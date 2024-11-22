from fastapi import FastAPI, HTTPException, UploadFile, Form, File, Query, Body, Request, WebSocket, BackgroundTasks
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect, WebSocketState
from pydantic import BaseModel
from collections import Counter
from langdetect import detect
from dotenv import load_dotenv
from PIL import Image
import requests
import datetime
import enchant
import base64
import os
import re
import asyncio
from typing import Optional, List, Dict, Any

# .envファイルから環境変数を読み込む
load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
access_token = None

app = FastAPI()

# CORSミドルウェアを設定
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # すべてのオリジンを許可。運用環境では特定のドメインに変更
  allow_credentials=True,
  allow_methods=["*"],  # GET, POST, PUT, DELETEなどすべてのHTTPメソッドを許可
  allow_headers=["*"],  # すべてのヘッダを許可
)

# データ保存用（簡単のためインメモリ使用）
received_data: Dict[str, Any] = {}  # 最後に処理されたデータを保存
clients: List[WebSocket] = []  # 接続中のWebSocketクライアントリスト

class IncomingData(BaseModel):
  aggContents: List[Dict[str, Any]]
  itemData: List[Dict[str, Any]]
  urlParams: Dict[str, Any]
  
class ProcessedDataRequest(BaseModel):
  exchange_rate: float
  fees_percentage: float

# eBayのOAuthエンドポイントからアクセストークンを取得
def get_ebay_token():
  global access_token
  response = requests.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    data={
      "grant_type": "client_credentials",
      "scope": "https://api.ebay.com/oauth/api_scope"
    },
    headers={
      "Authorization": f"Basic {base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()).decode()}",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  )
  if response.status_code == 200:
    access_token = response.json().get("access_token")
  else:
    raise HTTPException(status_code=500, detail="Failed to retrieve eBay access token")
  
# 商品の共通詳細情報を抽出する関数
def extract_common_details(items, threshold_percentage=5, top_n_keywords=6):
    brands = []
    categories = []
    keywords = []

    # 英語の辞書を初期化
    english_dict = enchant.Dict("en_US")

    # 有名ブランドのリスト（動的に更新可能）
    famous_brands = ["Gucci", "Prada", "Chanel", "Louis Vuitton", "Hermès", "Fendi", "Nike"]

    total_items = len(items)

    # 英語および日本語のストップワード定義
    stop_words_en = {"the", "and", "with", "for", "new", "authentic", "used", "a", "to", "in"}
    japanese_stop_words = {"の", "と", "で", "を", "は", "が", "も", "に", "へ", "です", "ます", "た"}

    for item in items:
      title = item.get("title", "").lower()

      # タイトルの言語を検出
      try:
        detected_language = detect(title)
      except Exception:
        detected_language = "unknown"  # 言語検出失敗時のデフォルト値

      # ブランドの抽出（強化版）
      brand_matches = [brand for brand in famous_brands if brand.lower() in title]
      if brand_matches:
        brands.extend(brand_matches)
      else:
        # フォールバック：正規表現で大文字始まりの単語を抽出（ブランド名の可能性あり）
        capitalized_words = re.findall(r'\b[A-Z][a-z]+\b', item.get("title", ""))
        brands.extend(capitalized_words)

      # カテゴリを抽出
      categories.extend(item.get("categories", []))

      # キーワードを抽出（強化版フィルタリング）
      title_words = re.findall(r'\b\w+\b', title)

      # 言語別のキーワード抽出処理
      if detected_language == "en":  # 英語のテキストの場合
        keywords.extend(
          [
            word for word in title_words
            if word not in stop_words_en  # ストップワードを除外
            and len(word) > 1  # 非常に短い単語を除外
            and not word.isdigit()
          ]
        )
      elif detected_language == "ja":  # 日本語のテキストの場合
        # 正規表現で日本語文字（漢字、ひらがな、カタカナ）を抽出
        japanese_keywords = re.findall(r'[\u3040-\u30FF\u4E00-\u9FFF]+', title)
        # 日本語ストップワードを除外
        keywords.extend(
          [word for word in japanese_keywords if word not in japanese_stop_words and len(word) > 1]
        )
      else:  # その他の言語（基本的なフィルタリングでフォールバック）
        keywords.extend(
          [
            word for word in title_words
            if word not in stop_words_en
            and len(word) > 1
            and not word.isdigit()
          ]
        )

    # キーワードの出現回数をカウント
    keyword_counts = Counter(keywords)

    # キーワードの出現頻度を計算（％表示）
    keyword_percentages = {word: (count / total_items) * 100 for word, count in keyword_counts.items()}

    # 頻度が閾値以上のキーワードをフィルタリング
    filtered_keywords = {
        word: percentage for word, percentage in keyword_percentages.items() if percentage >= threshold_percentage
    }

    # 頻度で降順ソートしたキーワードを取得
    sorted_keywords = sorted(filtered_keywords.items(), key=lambda x: x[1], reverse=True)

    # 上位N個のキーワードに限定
    sorted_keywords = sorted_keywords[:top_n_keywords]

    # ブランドとカテゴリの出現回数をカウント
    common_brands = Counter(brands).most_common(1)
    # (categoryId, categoryName)のタプルを抽出
    category_tuples = [
        (category["categoryId"], category.get("categoryName", "Unknown")) 
        for category in categories 
        if isinstance(category, dict) and "categoryId" in category
    ]

    common_categories = Counter(category_tuples).most_common()

    formatted_categories = [
        {"categoryId": category[0], "categoryName": category[1], "count": count}
        for (category, count) in common_categories
    ]

    return {
        "common_brands": [brand for brand, _ in common_brands],
        "common_categories": formatted_categories,
        "common_keywords": [keyword for keyword, _ in sorted_keywords],  # Sorted by frequency percentage
    }


# 画像を検索するエンドポイント
@app.post("/search-by-image")
async def search_by_image(
  file: Optional[UploadFile] = File(None),
  brand: Optional[str] = Form(None),
  keywords: Optional[List[str]] = Form(None),
  category: Optional[int] = Form(None),
  min_price: Optional[float] = Form(None),
  max_price: Optional[float] = Form(None),
  period: Optional[int] = Form(7),
  fees_percentage: float = Form(0.15),
  exchange_rate: float = Form(1.0),
):
    global access_token
    if not access_token:
      get_ebay_token()
        
    try:
      image_data = await file.read()
    except Exception as e:
      raise HTTPException(status_code=400, detail="Failed to process the image.")

    # Convert the image to base64 format
    image_base64 = base64.b64encode(image_data).decode()

    # Prepare the payload for the eBay image search API
    payload = {"image": image_base64}
    
    # Prepare query parameters
    params = {
      "q": f"{brand or ''} {' '.join(keywords[0].split(','))}".strip(),
      "limit": 15
    }

    # Construct the filter string
    filters = []

    if min_price is not None and max_price is not None:
      filters.append(f"price:[{min_price}..{max_price}]")
    if period:
      filters.append(f"listingDate:[{period}]")

    # Add the filter to params if filters exist
    if filters:
      params["filter"] = ",".join(filters)
        
    if category:
      category_ids = category
    else:
      category_ids = None
    if category_ids:
      params["category_ids"] = category_ids
    
        
    # Construct the search URL
    search_url = "https://api.ebay.com/buy/browse/v1/item_summary/search_by_image"
    search_url += "?" + "&".join([f"{key}={value}" for key, value in params.items() if value])
    
    # eBay API request headers
    headers = {
      "Authorization": f"Bearer {access_token}",
      "Content-Type": "application/json",
    }
    
    try:
      response = requests.post(search_url, json=payload, headers=headers)
        
      if response.status_code == 200:
        items = response.json().get("itemSummaries", [])
        
        common_data = extract_common_details(items)
        
        return {'common_data': common_data}
      else:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    except requests.exceptions.RequestException as e:
      raise HTTPException(status_code=500, detail=f"eBay API error: {str(e)}")
  
@app.post("/upload_data")
async def upload_data(data: IncomingData):
  """
  Endpoint to receive data from the browser extension.
  """
  global received_data
  
  # Simulate data processing
  received_data = data.dict()

  # Notify WebSocket clients that data is ready
  await notify_clients("Data is ready")

  return {"status": "success", "message": "Data uploaded successfully."}

@app.post("/get_processed_data")
async def get_processed_data(request: ProcessedDataRequest):
  """
  Endpoint to retrieve the processed data.
  """
  exchange_rate = request.exchange_rate
  fees_percentage = request.fees_percentage
  
  # Check if exchange rate and fees percentage are valid
  # if not (0 <= fees_percentage < 1):  # fees_percentage should be between 0 and 1 (e.g., 15% = 0.15)
  #     return {"message": "Invalid fees percentage."}

  print(exchange_rate, fees_percentage)
  
  if not received_data:
      return {"message": "No data available"}
  
  # Calculate total sold
  total_sold = sum(int(item['totalSold']) for item in received_data['itemData'])
  
  # Safely handle avg_price_str extraction and cleaning
  if received_data.get('aggContents') and len(received_data['aggContents']) > 0:
      avg_price_str = received_data['aggContents'][0].get("value", "$0")
  else:
      avg_price_str = "$0"  # Default value if no data available
  
  # Remove "$" and commas, ensure it's a valid number
  avg_price_str_cleaned = avg_price_str.replace('$', '').replace(',', '')
  
  try:
      avg_price = float(avg_price_str_cleaned) if avg_price_str_cleaned else 0.0
  except ValueError:
      avg_price = 0.0  # Fallback to 0 if the value is invalid
  
  # Calculate reference purchase price using the formula
  if avg_price == 0.0:
      return {"message": "Invalid average price."}

  try:
    reference_purchase_price = (avg_price * exchange_rate) / (1 - fees_percentage/ 100)
  except ZeroDivisionError:
      return {"message": "Fees percentage cannot be 100%."}

  # Update the received data with the calculated values
  received_data['total_sold'] = total_sold
  received_data['reference_price'] = round(reference_purchase_price)
  
  # Prepare the response with the processed data
  processed_data = {
      "status": "completed",
      "result": received_data  # In a real scenario, this would be the processed version
  }

  return processed_data


# WebSocket management
async def notify_clients(message: str):
  """
  Notify all connected WebSocket clients that data is ready.
  """
  global clients
  disconnected_clients = []
  for client in clients:
    try:
      if client.client_state == WebSocketState.CONNECTED:  # Check if WebSocket is open
        await client.send_text(message)
        print(f"Sent message: {message}")  # Log the message being sent
      else:
        disconnected_clients.append(client)
    except WebSocketDisconnect:
      disconnected_clients.append(client)

  # Remove disconnected clients
  for client in disconnected_clients:
    clients.remove(client)
      
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  """
  WebSocket endpoint for real-time updates.
  """
  await websocket.accept()
  clients.append(websocket)
  try:
    while True:
      # Keep the connection open
      data = await websocket.receive_text()
      await websocket.send_text(f"Message received: {data}")
  except WebSocketDisconnect:
    print("WebSocket disconnected")
  except Exception as e:
    print(f"WebSocket error: {e}")
  finally:
    try:
      clients.remove(websocket)
      if websocket.client_state == WebSocketState.CONNECTED:
        await websocket.close()
    except WebSocketDisconnect:
      pass
    except Exception as e:
      logging.error(f"Error closing WebSocket: {e}")

    
# Start a periodic task to clean stale clients (optional)
async def periodic_cleanup():
  global received_data
  while True:
    # Wait for a specified interval (e.g., 1 hour)
    await asyncio.sleep(3600)
    # Clear the received data if it's older than a threshold
    if received_data:
      received_data.clear()
      print("Received data has been cleared due to periodic cleanup.")
      
@app.on_event("startup")
async def on_startup():
  asyncio.create_task(periodic_cleanup())
          
