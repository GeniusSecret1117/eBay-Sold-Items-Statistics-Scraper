import React, { useState, useEffect } from "react";

/**
 * カスタム入力コンポーネント
 * @param {string} customValue - 入力値
 * @param {string} placeholderText - プレースホルダーのテキスト
 * @param {function} onChangeHandler - 入力値変更時のコールバック関数
 * @param {function} onKeyDownHandler - キー押下時のコールバック関数
 */
const CustomInput = ({ customValue, placeholderText, onChangeHandler, onKeyDownHandler, onBlurHandler }) => {
  const [focused, setFocused] = useState(false); // フォーカス状態を管理する

  // 入力値が空でない場合、フォーカス状態にする
  useEffect(() => {
    if (customValue !== "") {
      setFocused(true);
    }
  }, [customValue]);

  const onBlurHandlerFun = (e) => {
    if (!e.target.value) {
      setFocused(false)
    }
    onBlurHandler();
  }

  // CSSスタイル（JSオブジェクト形式で定義）
  const styles = {
    container: {
      position: "relative",
      // width: "300px", // 固定幅が必要な場合は指定
      // margin: "20px auto",
      // fontFamily: "Arial, sans-serif", // デフォルトフォントを指定
    },
    input: {
      width: "100%",
      border: "none",
      borderBottom: "2px solid #ccc",
      fontSize: "16px",
      padding: "5px 0",
      outline: "none",
      transition: "border-bottom 0.3s ease", // スムーズなアニメーションを追加
    },
    placeholder: {
      position: "absolute",
      left: 0,
      bottom: focused ? "28px" : "10px", // フォーカス時と未フォーカス時の位置を設定
      fontSize: focused ? "14px" : "16px", // フォーカス時にフォントサイズを縮小
      color: focused ? "#007BFF" : "#aaa", // フォーカス時に青色に変更
      transition: "all 0.3s ease", // アニメーション効果
    },
    underline: {
      position: "absolute",
      bottom: 0,
      left: focused ? "0" : "50%", // フォーカス時と未フォーカス時の位置を設定
      width: focused ? "100%" : "0", // フォーカス時に下線を全体に広げる
      height: "2px",
      background: "#007BFF",
      transition: "width 0.3s ease, left 0.3s ease", // アニメーション効果
    },
  };

  return (
    <div style={styles.container}>
      {/* プレースホルダーテキスト */}
      <label htmlFor="placeholder" style={styles.placeholder}>{placeholderText}</label>

      {/* 入力フィールド */}
      <input
        type="text"
        value={customValue}
        style={styles.input}
        onFocus={() => setFocused(true)} // フォーカス時の処理
        onBlur={onBlurHandlerFun} // フォーカス解除時に入力が空の場合は未フォーカス状態に戻す
        onChange={(e) => onChangeHandler(e.target.value)} // 入力値が変更されたときの処理
        onKeyDown={onKeyDownHandler} // キー押下時の処理
      />

      {/* アニメーション付き下線 */}
      <span style={styles.underline}></span>
    </div>
  );
};

export default CustomInput;
