import React, { useState } from 'react';
import CustomInput from './CutomInput'; // カスタム入力コンポーネント

/**
 * 手数料入力フォームコンポーネント
 */
const FeeForm = ({ feesPercentageValue, setFeesPercentageHandler }) => {
  // 初期値をローカルストレージから取得。存在しない場合はデフォルト値 0.15 (15%) を使用
  // const [feesPercentage, setFeesPercentage] = useState(
  //   localStorage.getItem("feesPercentage") || 15
  // );

  /**
   * 手数料を設定し、ローカルストレージにも保存
   * @param {string|number} fee - 入力された手数料
   */
  // const setFees = (fee) => {
  //   setFeesPercentage(fee); // ローカルステートを更新
  //   localStorage.setItem("feesPercentage", fee); // ローカルストレージに保存
  // };

  return (
    <div>
      {/* カスタム入力コンポーネント */}
      <CustomInput
        customValue={feesPercentageValue} // 現在の手数料値
        placeholderText="手数料 (%) を入力" // プレースホルダーの日本語化
        onChangeHandler={setFeesPercentageHandler} // 入力変更時の処理
        onBlurHandler={()=>{}}
      />
    </div>
  );
};

export default FeeForm;
