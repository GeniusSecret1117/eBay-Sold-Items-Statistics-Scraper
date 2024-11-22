import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // React Toastifyのスタイルをインポート
import DragAndDrop from "./DragAndDrop";
import TagInput from './TagInput';
import PriceFilter from './PriceFilter';
import PeriodSelector from './PeriodSelector';
import ExchangeRate from './ExchangeRate';
import FeeForm from "./FeeForm";
import CategorySelector from './CategorySelector';
import ScrollToTopButton from './scrollToTopButton/ScrollToTopButton';
import styles from './productSearch/ProductSearch.module.css';
import TerapeakData from "./TerapeakData";
import AuctionTypeSelector from "./AuctionTypeSelector";
import CustomInput from './CutomInput';
import Calculator from './Calculator';
import CalculatorModal from './CalculatorModal';

const ProductSearch = () => {
  const [brands, setBrands] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [minimumPrice, setMinimumPrice] = useState(10);
  const [maximumPrice, setMaximumPrice] = useState(5000);
  const [period, setPeriod] = useState(7);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  // const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [terapeakWindow, setTerapeakWindow] = useState(null);

  const [exchangeRate, setExchangeRate] = useState(Number(localStorage.getItem("exchangeRate")) || 130);
  const [feesPercentage, setFeesPercentage] = useState(Number(localStorage.getItem("feesPercentage")) || 15);
  const [shippingCost, setShippingCost] = useState(Number(localStorage.getItem("shippingCost")) || 2000);
  const [targetProfitRate, setTargetProfitRate] = useState(Number(localStorage.getItem("targetProfitRate")) || 20)

  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  const handleCloseModal = () => {
    setShowCalculatorModal(false);  // Close the modal
  };

  const handleOpenModal = () => {
    setShowCalculatorModal(true);  // Open the modal
  };

  const setExchangeRateHandler = (rate) => {
    setExchangeRate(rate); // ローカルステートを更新
    localStorage.setItem("exchangeRate", rate); // ローカルストレージに保存
  }

  const setFeesPercentageHandler = fee => {
    setFeesPercentage(fee);
    localStorage.setItem("feesPercentage", fee);
  }

  const setShippingCostHandler = shipping_cost => {
    setShippingCost(shipping_cost);
    localStorage.setItem("shippingCost", shipping_cost);
  }

  const setTargetProfitRateHandler = profit_rate => {
    setTargetProfitRate(profit_rate);
    localStorage.setItem("targetProfitRate", profit_rate);
  }

  const sendRequest = async (file = null) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const isImageSearch = !!image; 

      if (file || isImageSearch) {
        const formData = new FormData();
        if (file) {
          formData.append('file', file);  
        } else {
          formData.append('file', image);
        }
        
        formData.append('brand', brands[0] || "");
        formData.append('keywords', keywords);
        formData.append('min_price', minimumPrice);
        formData.append('max_price', maximumPrice);
        formData.append('period', period);
        formData.append('category', selectedCategory);
        formData.append('fees_percentage', localStorage.getItem("feesPercentage") || 0.15);
        formData.append('exchange_rate', localStorage.getItem("exchangeRate") || 1.0);

        response = await axios.post(`http://localhost:8000/search-by-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const payload = {
          brand: brands[0] || "",
          keywords,
          min_price: minimumPrice,
          max_price: maximumPrice,
          period,
          fees_percentage: localStorage.getItem("feesPercentage") || 0.15,
          exchange_rate: localStorage.getItem("exchangeRate") || 1.0,
        };

        response = await axios.post(`http://localhost:8000/search-by-keywords`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // setProducts(response.data.items || []);
      // setSummary(response.data.summary || null);
      commonDataHandler(response.data.common_data)
      
    } catch (err) {
      setError("データ取得中にエラーが発生しました。");

      // エラー発生時の通知を表示
      toast.error("データ取得中にエラーが発生しました。", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (file) => {
    setImage(file);
    if (file) {
      sendRequest(file);  
    } else {
      setCategories([])
    }
  };

  const commonDataHandler = (data) => {
    setBrands(data.common_brands || []);
    setKeywords(data.common_keywords || []);
    setCategories(data.common_categories || []);
  };

  const handleClearAll = () => {
    setBrands([]);
    setKeywords([]);
    setCategories([]);
    setSelectedCategory(0);
    setMinimumPrice(10);
    setMaximumPrice(5000);
    setPeriod(7);
    setImage(null);
    // setProducts([]);
    setSummary(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (keywords.length === 0) {
      toast.error("キーワードを入力してください。", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    const brand = brands[0] || ""; // 最初のブランドを取得、なければ空文字を使用
    const categoryId = selectedCategory; // 選択されたカテゴリーIDを使用
    const {timeZone} = Intl.DateTimeFormat().resolvedOptions(); // ユーザーのタイムゾーンを取得

    const endDate = Date.now();
    const startDate = endDate - (period * 24 * 60 * 60 * 1000);

    const encodedKeywords = [brand, ...keywords].filter(Boolean).join(' ');
  
    const baseUrl = "https://www.ebay.com/sh/research";
    const queryParams = new URLSearchParams({
      marketplace: "EBAY-US", // 固定値
      keywords: encodedKeywords, // キーワードとブランドを組み合わせる
      dayRange: period || "7", // 期間が設定されていなければ30日をデフォルト
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      categoryId: categoryId || 0, // カテゴリーID（デフォルトは"0"）
      minPrice: minimumPrice,
      maxPrice: maximumPrice,
      offset: "0", // 固定値
      limit: "50", // 固定値
      tabName: "SOLD", // 売れた商品のみを表示
      tz: encodeURIComponent(timeZone), // タイムゾーン
    });

    // Add 'format' based on selectedType
    let formatParam = '';
    if (selectedType === 'auction') {
      formatParam = 'AUCTION';
    } else if (selectedType === 'fixed') {
      formatParam = 'FIXED_PRICE';
    }

    if (formatParam) {
      queryParams.append('format', formatParam); // Add format to query
    }
    
    const terapeakURL = `${baseUrl}?${queryParams.toString()}`;

    if (terapeakWindow && !terapeakWindow.closed) {
      // If the window is already open, focus it and update the location
      terapeakWindow.location.href = terapeakURL;
      // terapeakWindow.focus();
    } else {
      // Open a new window and save the reference
      const newWindow = window.open(terapeakURL, "terapeakWindow");
      if (newWindow) {
        setTerapeakWindow(newWindow);
      } else {
        toast.error("ポップアップを開くのがブロックされています。ブラウザ設定を確認してください。", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

    // if (!urlOpened) {
    //   window.open(terapeakURL, "_blank");
    //   setUrlOpened(true);
    // } else {

    // }

    // console.log(terapeakURL);
    // window.open(terapeakURL, "_blank");

    // setTimeout(() => {
    //   window.focus();
    // }, 200);
  };

  const resetSearchParams = (params) => {
    console.log(params.keywords)
    const [brand, ...keywords] = params.keywords.split(' ');
    const categoryId = params.categoryId;
    const period = params.dayRange;
    const minPrice = params.minPrice;
    const maxPrice = params.maxPrice;
    const auctionType = params.selectedType;

    setBrands([brand]);
    setKeywords(keywords);
    setSelectedCategory(categoryId);
    setPeriod(period);
    setMinimumPrice(minPrice);
    setMaximumPrice(maxPrice);
    setSelectedType(auctionType);
  }

  return (
    <div className={`row mt-4 ${styles.productSearch}`}>
      <h1 className={`${styles.title}`}>製品検索</h1>

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <div className="col-md-5">
        <DragAndDrop image={image} setImageHandler={handleFileChange} />

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <TagInput 
              displayText="ブランドを追加" 
              tags={brands} 
              setTagsHandler={setBrands} 
            />
          </div>

          <div className="mt-4">
            <TagInput 
              displayText="キーワードを追加" 
              tags={keywords} 
              setTagsHandler={setKeywords} 
            />
          </div>

          <div className="mt-4">
            <CategorySelector 
              categories={categories}
              selectedCat={selectedCategory}
              setCatHandler={setSelectedCategory}
            />
          </div>

          <div className="mt-4">
            <PriceFilter 
              minPrice={minimumPrice} 
              maxPrice={maximumPrice} 
              setMinPriceHandler={setMinimumPrice} 
              setMaxPriceHandler={setMaximumPrice} 
            />
          </div>

          <div className="mt-4">
            <PeriodSelector
              selectedPeriod={period}
              onPeriodChange={setPeriod} 
            />
          </div>

          <div className="mt-4">
            <AuctionTypeSelector 
              selectedType={selectedType}
              setSelectedTypeHandler={setSelectedType}
            />
          </div>

          <div className="card mt-4">
            <div className="card-body d-flex justify-content-between pt-4">
              <ExchangeRate 
                exchangeRateValue={exchangeRate}
                setExchangeRateHandler={setExchangeRateHandler}
              />
              <FeeForm 
                feesPercentageValue={feesPercentage}
                setFeesPercentageHandler={setFeesPercentageHandler}
              />
            </div>
          </div>

          
          <div className="button-group d-flex justify-content-between align-items-center mt-5 mb-4">
            {/* Clear All Button */}
            <button
              type="button"
              className="btn btn-secondary w-50 p-2 me-2"
              onClick={handleClearAll}
            >
              クリア
            </button>
            {/* Search Button */}
            <button type="submit" className="btn btn-primary w-50 p-2">
              {loading ? "ロード中..." : "検索"}
            </button>
            
            
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* <div className="mt-5 mb-5 p-3">
        <button
          type="button"
          className="btn btn-secondary w-50 p-2 mt-4"
          onClick={() => setShowCalculatorModal(true)}  // Trigger opening modal
        >
          計算機
        </button>
          <Calculator 
            exchangeRateValue={exchangeRate}
            feesPercentageValue={feesPercentage}
            shippingCostValue={shippingCost}
            targetProfitRateValue={targetProfitRate}
            setExchangeRateHandler={setExchangeRateHandler}
            setFeesPercentageHandler={setFeesPercentageHandler}
            setShippingCostHandler={setShippingCostHandler}
            setTargetProfitRateHandler={setTargetProfitRateHandler}
          />
        </div> */}



      </div>

      <div className="col-md-7" style={{ position: 'relative' }}>
      <div className="" style={{ position: 'fixed', right: '0'  }}>
          <button
            type="button"
            className="btn p-0 border-0"
            style={{ background: 'none' }}
            onClick={() => setShowCalculatorModal(true)}
          >
            <img 
              src="/images/calculator.png" // Corrected path
              alt="計算機" 
              className="w-50 hover-enlarge"
              style={{ transition: 'transform 0.3s ease' }}
            />
          </button>
          <style jsx="true">{`
            .hover-enlarge:hover {
              transform: scale(1.1);
            }
          `}</style>
        </div>
        <TerapeakData 
          setSearchParamsHandler={resetSearchParams}
        />
      </div>

      {/* 通知の表示場所 */}
      <CalculatorModal 
        show={showCalculatorModal}
        handleClose={handleCloseModal}
        exchangeRateValue={exchangeRate}
        feesPercentageValue={feesPercentage}
        shippingCostValue={shippingCost}
        targetProfitRateValue={targetProfitRate}
        setExchangeRateHandler={setExchangeRateHandler}
        setFeesPercentageHandler={setFeesPercentageHandler}
        setShippingCostHandler={setShippingCostHandler}
        setTargetProfitRateHandler={setTargetProfitRateHandler}
      />
      <ToastContainer />
      <ScrollToTopButton />
    </div>
  );
};

export default ProductSearch;
