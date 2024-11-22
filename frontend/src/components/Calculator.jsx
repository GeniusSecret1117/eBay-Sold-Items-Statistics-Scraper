import React, { useState } from 'react';
import CustomInput from './CutomInput';
import { toast } from 'react-toastify';

const Calculator = ({ exchangeRateValue, feesPercentageValue, shippingCostValue, targetProfitRateValue, setExchangeRateHandler, setFeesPercentageHandler, setShippingCostHandler, setTargetProfitRateHandler }) => {
  const [auctionPrice, setAuctionPrice] = useState(100);
  const [referencePrice, setReferencePrice] = useState(0);
  const [expectedProfit, setExpectedProfit] = useState(0);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);

  const [error, setError] = useState('');

  const validateInputs = () => {
    if (isNaN(auctionPrice) || auctionPrice < 0) {
      const message = '落札予想価格は数字で0以上でなければなりません';
      setError(message);
      toast.error(message);
      return false;
    }
    if (isNaN(exchangeRateValue) || exchangeRateValue <= 0) {
      const message = '為替レートは0より大きい数字でなければなりません';
      setError(message);
      toast.error(message);
      return false;
    }
    if (isNaN(feesPercentageValue) || feesPercentageValue < 0) {
      const message = '手数料は0以上の数字でなければなりません';
      setError(message);
      toast.error(message);
      return false;
    }
    if (isNaN(shippingCostValue) || shippingCostValue < 0) {
      const message = '送料は0以上の数字でなければなりません';
      setError(message);
      toast.error(message);
      return false;
    }
    if (isNaN(targetProfitRateValue) || targetProfitRateValue < 0) {
      const message = '利益率は0以上の数字でなければなりません';
      setError(message);
      toast.error(message);
      return false;
    }
    setError(''); // Clear error message if all inputs are valid
    return true;
  };

  const onCalculateHandler = () => {
    if (!validateInputs()) {
      return;
    };

    const S = parseFloat(auctionPrice);
    const R = parseFloat(exchangeRateValue);
    const F = parseFloat(feesPercentageValue) / 100;
    const S_h = parseFloat(shippingCostValue);
    const M = parseFloat(targetProfitRateValue) / 100;

    console.log(S, R, F, S_h, M)

    const revenue = S * R;

    const P = M * revenue;

    const C = revenue - P - (S * F * R) - S_h;

    const B = (C + S_h) / (R * (1 - F));

    // const P_auction = parseFloat(auctionPrice);
    // const R_JPY_USD = parseFloat(exchangeRateValue);
    // const F_fee = parseFloat(feesPercentageValue) / 100;
    // const C_shipping = parseFloat(shippingCostValue);
    // const P_margin = parseFloat(targetProfitRateValue) / 100;

    // // 仕入れ参考価格を計算 (Reference Purchase Price)
    // const purchasePrice = (P_auction * R_JPY_USD) / (1 - F_fee);

    // // 想定利益を計算 (Estimated Profit)
    // const expected_profit = purchasePrice * P_margin;

    // // 損益分岐点を計算 (Break-even Point)
    // const break_evenPoint = purchasePrice + C_shipping;

    setReferencePrice(C.toFixed(2));
    setExpectedProfit(P.toFixed(2));
    setBreakEvenPoint(B.toFixed(2));
  }

  return (
    <>
      <h4>計算機</h4>
      <div className="mt-4">
        <CustomInput
          customValue={auctionPrice}
          placeholderText="落札予想価格"
          onChangeHandler={setAuctionPrice}
          onBlurHandler={()=>{}}
        />
      </div>
      <div className="mt-4">
        <CustomInput
          customValue={exchangeRateValue}
          placeholderText="レート (ドル円)"
          onChangeHandler={setExchangeRateHandler}
          onBlurHandler={()=>{}}
        />
      </div>
      <div className="mt-4">
        <CustomInput
          customValue={feesPercentageValue}
          placeholderText="手数料 (%)"
          onChangeHandler={setFeesPercentageHandler}
          onBlurHandler={()=>{}}
        />
      </div>
      <div className="mt-4">
        <CustomInput
          customValue={shippingCostValue}
          placeholderText="送料 (円)"
          onChangeHandler={setShippingCostHandler}
          onBlurHandler={()=>{}}
        />
      </div>
      <div className="mt-4">
        <CustomInput
          customValue={targetProfitRateValue}
          placeholderText="利益率 (%)"
          onChangeHandler={setTargetProfitRateHandler}
          onBlurHandler={()=>{}}
        />
      </div>
      <div className="mt-4">
        <button className='btn btn-primary w-100' onClick={onCalculateHandler}>計算</button>
      </div>
      <div className="mt-4">
        <h5>結果</h5>
        <table className='table'>
          <thead>
            <tr>
              <th>仕入れ参考価格(¥)</th>
              <th>想定利益(¥)</th>
              <th>損益分岐点($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{referencePrice}</td>
              <td>{expectedProfit}</td>
              <td>{breakEvenPoint}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Calculator
