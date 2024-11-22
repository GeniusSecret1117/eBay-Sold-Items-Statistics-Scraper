import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "./productSearch/TerapeakData.css"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function TerapeakData({ setSearchParamsHandler }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    );

    socket.onopen = () => socket.send("Hello, Server! Component has mounted.");
    socket.onmessage = (event) => {
      if (event.data === "Data is ready") fetchProcessedData();
    };
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      toast.error("WebSocketエラーが発生しました。", { position: "top-right", autoClose: 5000 });
    };
    socket.onclose = () => {
      toast.warning("WebSocket接続が切断されました。再接続中...", { position: "top-right" });
      setTimeout(() => {
        setWs(new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`));
      }, 5000);
    };

    setWs(socket);
    return () => socket.readyState === WebSocket.OPEN && socket.close();
  }, [setSearchParamsHandler]);

  const fetchProcessedData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/get_processed_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchange_rate: parseFloat(localStorage.getItem("exchangeRate")) || 1.0,
          fees_percentage: parseFloat(localStorage.getItem("feesPercentage")) || 0.15,
        }),
      });
      const jsonResponse = await response.json();
      if (jsonResponse.status === "completed") {
        setData(jsonResponse.result);
        setSearchParamsHandler(jsonResponse.result.urlParams);
        toast.success("データの取得に成功しました！", { position: "top-right", autoClose: 3000 });
      } else {
        setError("データがまだ準備できていません。");
      }
    } catch (err) {
      setError(`データの取得中にエラーが発生しました: ${err.message}`);
      toast.error(`エラー: ${err.message}`, { position: "top-right", autoClose: 5000 });
    }
    setLoading(false);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="terapeak-container">
      {/* Render logic for data */}
    </div>
  );
}


export default TerapeakData;
