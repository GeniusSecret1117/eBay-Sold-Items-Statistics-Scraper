import React from 'react'

const Temp = () => {
  return (
    <div>
      {/* {summary && (
        <div className={styles.summarySection}>
          <h2>サマリー</h2>
          
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>同類の販売個数</strong></td>
                <td>
                  {summary.total_items_sold ? (
                    summary.total_items_sold
                  ) : (
                    <span className={styles.noData}>データなし</span>
                  )}
                </td>
              </tr>

              
              <tr>
                <td><strong>同類の実売価格の平均</strong></td>
                <td>
                  {summary.average_selling_price ? (
                    <>
                      {summary.average_selling_price} {summary.currency || ""}
                    </>
                  ) : (
                    <span className={styles.noData}>データなし</span>
                  )}
                </td>
              </tr>

              
              <tr>
                <td><strong>同類の出品から販売までの平均期間</strong></td>
                <td>
                  {summary.average_time_to_sale ? (
                    `${summary.average_time_to_sale} 日`
                  ) : (
                    <span className={styles.noData}>データなし</span>
                  )}
                </td>
              </tr>

              
              <tr>
                <td><strong>参考仕入れ価格</strong></td>
                <td>
                  {summary.reference_purchase_price ? (
                    <>
                      {summary.reference_purchase_price} {summary.currency || ""}
                    </>
                  ) : (
                    <span className={styles.noData}>データなし</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      )}

        <div className={styles.productsList}>
          {products.length > 0 ? (
            products.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <img 
                  src={item.image.imageUrl || "placeholder.jpg"} 
                  alt={item.title || "商品画像"} 
                  className={styles.itemImage} 
                />
                <h3 className={styles.itemTitle}>{item.title || "タイトル不明"}</h3>
                <p className={styles.itemPrice}>
                  実売価格: {item.price.value || "不明"} {item.price.currency || ""}
                </p>
                <p className={styles.timeToSale}>
                  参考仕入れ価格: {item.recommended_purchase_price || "不明"} 円
                </p>
                <a 
                  href={item.itemWebUrl || "#"} 
                  className={styles.viewItem} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  商品を見る
                </a>
              </div>
            ))
          ) : (
            <p className="p-5">該当する商品はありません。</p>
          )}
        </div> */}
    </div>
  )
}

export default Temp
