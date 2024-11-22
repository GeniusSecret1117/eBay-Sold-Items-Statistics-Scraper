import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * ドラッグ＆ドロップによる画像アップロードコンポーネント
 * @param {File|null} image - 現在選択されている画像
 * @param {Function} setImageHandler - 画像の状態を更新する関数
 */
const DragAndDrop = ({ image, setImageHandler }) => {
  /**
   * ファイルがドロップされたときの処理
   * @param {File[]} acceptedFiles - ドロップされたファイルリスト
   */
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    // ファイルタイプの確認（画像のみ許可）
    if (file && file.type.startsWith("image/")) {
      setImageHandler(file); // 画像をセット
    } else {
      console.log('無効な画像形式です。'); // ログに無効な画像形式を表示
    }
  }, [setImageHandler]);

  // Dropzoneの設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1, // アップロード可能なファイル数を1つに制限
  });

  /**
   * 選択された画像を削除する処理
   * @param {Event} e - イベントオブジェクト
   */
  const removeImage = (e) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    setImageHandler(null); // 画像をクリア
  };

  return (
    <div {...getRootProps()} style={styles.dropzone}>
      <input {...getInputProps()} />
      {!image ? (
        <div style={styles.placeholder}>
          {isDragActive ? (
            <p>ここに画像をドロップしてください...</p> // ドラッグ中のメッセージ
          ) : (
            <p>画像をドラッグ＆ドロップ、またはクリックして選択してください</p> // 通常時のメッセージ
          )}
        </div>
      ) : (
        <div style={styles.imageContainer}>
          {/* 選択された画像のプレビュー表示 */}
          <img 
            src={URL.createObjectURL(image)} 
            alt="アップロード済み画像のプレビュー" 
            style={styles.preview} 
          />
          {/* 画像削除ボタン */}
          <button style={styles.removeButton} onClick={removeImage}>X</button>
        </div>
      )}
    </div>
  );
};

// スタイル定義（CSS-in-JS形式）
const styles = {
  dropzone: {
    width: '100%',
    height: '360px',
    border: '2px dashed #cccccc',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    // margin: '20px auto',
    overflow: 'hidden',
  },
  placeholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#888',
    fontSize: '16px',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  removeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'black',
    color: '#fff',
    border: 'none',
    padding: '2px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DragAndDrop;
