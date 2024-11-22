import React from "react";
import Select from "react-select";

/**
 * カテゴリー選択コンポーネント
 * @param {Array} categories - カテゴリーのリスト
 * @param {number} selectedCat - 選択されたカテゴリーID
 * @param {function} setCatHandler - 選択変更時の処理を行うコールバック関数
 */
const CategorySelector = ({ categories, selectedCat, setCatHandler }) => {
  /**
   * 選択変更時の処理
   * @param {Object} selectedOption - 選択されたオプション
   */
  const handleChange = (selectedOption) => {
    // 選択されたカテゴリーIDをセット
    setCatHandler(selectedOption ? selectedOption.value : 0); 
  };

  // "All" optionを追加
  const allOption = { value: 0, label: "すべて" };

  // カテゴリーのリストをreact-select用のフォーマットに変換
  const options = [allOption, ...categories.map((cat) => ({
    value: cat.categoryId,
    label: cat.categoryName,
  }))];

  return (
    <div className="mb-3">
      {/* カテゴリー選択用のセレクトボックス */}
      <Select
        id="categories"
        options={options} // オプションリスト
        value={options.find((opt) => opt.value === selectedCat)} // 選択済みオプションを表示
        onChange={handleChange} // 選択変更時の処理
        placeholder="カテゴリーを選択してください" // プレースホルダーテキスト
      />
    </div>
  );
};

export default CategorySelector;
