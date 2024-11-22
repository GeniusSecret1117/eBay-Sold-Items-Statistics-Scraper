import React, { useState } from 'react';
import styled from 'styled-components';

// Styled-components for a clean UI
const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // padding: 10px;
`;

const PriceSlider = styled.input`
  width: 100%;
  margin: 10px 0;
  cursor: pointer;
`;

const PriceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
`;

const PriceInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const PriceInput = styled.input`
  width: 45%;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PriceFilter = ({ minPrice, maxPrice, setMinPriceHandler, setMaxPriceHandler }) => {
  // const [minPrice, setMinPrice] = useState(10);
  // const [maxPrice, setMaxPrice] = useState(5000);
  // const [appliedMinPrice, setAppliedMinPrice] = useState(null);
  // const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  // Handle min price change (via input field)
  const handleMinPriceChange = (e) => {
    const newMinPrice = parseInt(e.target.value, 10);
    if (newMinPrice > maxPrice) {
      setMaxPriceHandler(newMinPrice);
    }
    setMinPriceHandler(newMinPrice);
  };

  // Handle max price change (via input field)
  const handleMaxPriceChange = (e) => {
    const newMaxPrice = parseInt(e.target.value, 10);
    if (newMaxPrice < minPrice) {
      setMinPriceHandler(newMaxPrice);
    }
    setMaxPriceHandler(newMaxPrice);
  };

  // Handle min price change (via slider)
  const handleMinPriceSliderChange = (e) => {
    const newMinPrice = parseInt(e.target.value, 10);
    if (newMinPrice > maxPrice) {
      setMaxPriceHandler(newMinPrice);
    }
    setMinPriceHandler(newMinPrice);
  };

  // Handle max price change (via slider)
  const handleMaxPriceSliderChange = (e) => {
    const newMaxPrice = parseInt(e.target.value, 10);
    if (newMaxPrice < minPrice) {
      setMinPriceHandler(newMaxPrice);
    }
    setMaxPriceHandler(newMaxPrice);
  };

  // Apply the selected filter
  // const applyFilter = () => {
  //   setAppliedMinPrice(minPrice);
  //   setAppliedMaxPrice(maxPrice);
  // };

  return (
    <div>
      <PriceRangeContainer>
        <label htmlFor="price" className='text-muted mb-3'>最小価格と最大価格を選択してください</label>
        <PriceLabel>
          <span>$ {minPrice}</span>
          <span>-</span>
          <span>$ {maxPrice}</span>
        </PriceLabel>

        {/* Sliders for price range */}
        <PriceSlider
          type="range"
          min="0"
          max="5000"
          step="1"
          value={minPrice}
          onChange={handleMinPriceSliderChange}
        />
        <PriceSlider
          type="range"
          min="0"
          max="5000"
          step="1"
          value={maxPrice}
          onChange={handleMaxPriceSliderChange}
        />

        {/* Input fields for min and max price */}
        <PriceInputContainer>
          <PriceInput
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min"
          />
          <PriceInput
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
          />
        </PriceInputContainer>

        {/* <Button onClick={applyFilter}>Apply</Button> */}
      </PriceRangeContainer>

      {/* {appliedMinPrice !== null && appliedMaxPrice !== null && (
        <div>
          <p>Price Filter Applied: ${appliedMinPrice} - ${appliedMaxPrice}</p>
        </div>
      )} */}
    </div>
  );
};

export default PriceFilter;
