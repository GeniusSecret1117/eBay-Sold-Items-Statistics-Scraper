import React, { useState } from 'react';
import CustomInput from './CutomInput'; // カスタム入力コンポーネント

/**
 * 為替レート入力コンポーネント
 */
const ExchangeRate = ({ exchangeRateValue, setExchangeRateHandler }) => {
  // 初期値としてローカルストレージから取得。存在しない場合はデフォルト値 1 を使用
  // const [exchangeRate, setExchangeRate] = useState(
  //   localStorage.getItem("exchangeRate") || 1
  // );

  /**
   * 為替レートを設定し、ローカルストレージにも保存
   * @param {string|number} rate - 入力された為替レート
   */
  // const setExRate = (rate) => {
  //   setExchangeRate(rate); // ローカルステートを更新
  //   localStorage.setItem("exchangeRate", rate); // ローカルストレージに保存
  // };

  return (
    <div>
      {/* カスタム入力コンポーネント */}
      <CustomInput
        customValue={exchangeRateValue} // 現在の為替レート
        placeholderText="為替レートを入力" // プレースホルダーの日本語化
        onChangeHandler={setExchangeRateHandler} // 入力変更時の処理
        onBlurHandler={()=>{}}
      />
    </div>
  );
};

export default ExchangeRate;
