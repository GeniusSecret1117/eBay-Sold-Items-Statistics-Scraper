import React, { useState } from "react";
import CustomInput from "./CutomInput";

/**
 * カスタムタグ入力コンポーネント
 * @param {string} displayText - 入力フィールドのプレースホルダーとして表示するテキスト
 * @param {Array<string>} tags - 現在のタグリスト
 * @param {function} setTagsHandler - タグリストを更新する関数
 */
const TagInput = ({ displayText, tags, setTagsHandler }) => {
  const [inputValue, setInputValue] = useState(""); // 入力フィールドの現在の値を管理

  /**
   * タグを追加する処理
   * @param {string} tag - 追加するタグ
   */
  const addTag = (tag) => {
    const trimmedTag = tag.trim(); // 余分なスペースを削除
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTagsHandler([...tags, trimmedTag]); // 新しいタグを追加
    }
    setInputValue(""); // 入力フィールドをクリア
  };

  /**
   * キーボード操作でタグを追加
   * @param {object} event - キーボードイベント
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault(); // デフォルトの動作をキャンセル
      addTag(inputValue); // タグを追加
    }
  };

  /**
   * フィールドがフォーカスを失った時にタグを追加
   */
  const handleBlur = () => {
    addTag(inputValue); // タグを追加
  };

  /**
   * 指定したインデックスのタグを削除する処理
   * @param {number} indexToRemove - 削除対象のタグのインデックス
   */
  const removeTag = (indexToRemove) => {
    setTagsHandler(tags.filter((_, index) => index !== indexToRemove)); // 指定インデックスを除く新しい配列を作成
  };

  return (
    <div style={styles.container}>
      {/* 入力フィールド */}
      <CustomInput
        customValue={inputValue}
        placeholderText={displayText} // プレースホルダー (例: "タグを追加")
        onChangeHandler={setInputValue} // 入力値の更新
        onKeyDownHandler={handleKeyDown} // Enter または , の処理
        onBlurHandler={handleBlur} // フィールドがフォーカスを失った時の処理
      />
      {/* タグリストの表示 */}
      <div style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <div key={index} style={styles.tag}>
            {tag}
            {/* タグ削除ボタン */}
            <span
              style={styles.deleteIcon}
              onClick={() => removeTag(index)} // 指定したタグを削除
            >
              🗑️
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// JavaScriptオブジェクトでCSSスタイルを定義
const styles = {
  container: {
    margin: "10px 0",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap", // タグを折り返し表示
    gap: "10px", // タグ間のスペース
    marginBottom: "10px", // 下部の余白
    marginTop: "10px", // 上部の余白
  },
  tag: {
    display: "flex",
    alignItems: "center", // 中央揃え
    padding: "5px 10px", // 内側の余白
    background: "#007BFF", // 青色背景
    color: "#fff", // 白色文字
    borderRadius: "14px", // 丸みを帯びた角
    fontSize: "14px", // 文字サイズ
  },
  deleteIcon: {
    marginLeft: "8px", // 左側の余白
    cursor: "pointer", // マウスカーソルをポインターに変更
  },
};

export default TagInput;
