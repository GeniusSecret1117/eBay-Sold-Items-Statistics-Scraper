import React, { useState } from 'react';

/**
 * 期間選択コンポーネント
 * @param {function} onPeriodChange - 親コンポーネントに選択された期間を通知する関数
 */
const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  // const [selectedPeriod, setSelectedPeriod] = useState('7'); // 初期値は「7日間」

  /**
   * ドロップダウン選択肢が変更されたときの処理
   * @param {object} event - 選択イベント
   */
  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value; // 新しい選択値を取得
    // setSelectedPeriod(newPeriod); // ローカルステートを更新
    onPeriodChange(newPeriod); // 親コンポーネントに変更を通知
  };

  // セレクトボックスの基本スタイル
  const selectStyle = {
    padding: '8px 12px', // 内側の余白
    fontSize: '16px', // フォントサイズ
    border: '1px solid #ccc', // ボーダースタイル
    borderRadius: '4px', // 角の丸み
    cursor: 'pointer', // カーソルをポインターに変更
    transition: 'all 0.3s ease', // スムーズなスタイル変更
  };

  // フォーカス時のスタイル
  const selectFocusStyle = {
    outline: 'none', // 外枠の標準フォーカスを非表示
    borderColor: '#007bff', // ボーダーカラーを青色に変更
    boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)', // 青い発光のような効果
  };

  return (
    <div>
      {/* ドロップダウンメニュー */}
      <select
        value={selectedPeriod} // 現在の選択値
        onChange={handlePeriodChange} // 値が変更されたときの処理
        style={selectStyle} // デフォルトスタイル
        onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)} // フォーカス時のスタイルを適用
        onBlur={(e) => Object.assign(e.target.style, selectStyle)} // フォーカス解除時にスタイルを戻す
        className="form-control"
      >
        <option value="7">過去7日間</option>
        <option value="30">過去1か月</option>
        <option value="90">過去3か月</option>
        <option value="365">過去1年間</option>
      </select>
    </div>
  );
};

export default PeriodSelector;
