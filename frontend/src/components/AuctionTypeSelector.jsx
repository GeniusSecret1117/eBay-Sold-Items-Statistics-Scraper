import React, { useState } from 'react';
import './productSearch/AuctionTypeSelector.css'; // Add custom styling

const AuctionTypeSelector = ({ selectedType, setSelectedTypeHandler }) => {

  const handleChange = (e) => {
    setSelectedTypeHandler(e.target.value);
  };

  return (
    <div className="auction-type-selector card p-3">
      <p>落札形式を選択してください</p>
      <div className="radio-buttons-container">
        <label className={`radio-label ${selectedType === 'all' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="auction-type"
            value="all"
            checked={selectedType === 'all'}
            onChange={handleChange}
          />
          すべて
        </label>
        <label className={`radio-label ${selectedType === 'auction' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="auction-type"
            value="auction"
            checked={selectedType === 'auction'}
            onChange={handleChange}
          />
          オークション
        </label>
        <label className={`radio-label ${selectedType === 'fixed' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="auction-type"
            value="fixed"
            checked={selectedType === 'fixed'}
            onChange={handleChange}
          />
          固定価格
        </label>
      </div>
    </div>
  );
};

export default AuctionTypeSelector;
