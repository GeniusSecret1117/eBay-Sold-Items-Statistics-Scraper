import React from 'react';
import Calculator from './Calculator';
import { Modal, Button } from 'react-bootstrap';  // Using React-Bootstrap for styling

const CalculatorModal = ({ show, handleClose, exchangeRateValue, feesPercentageValue, shippingCostValue, targetProfitRateValue, setExchangeRateHandler, setFeesPercentageHandler, setShippingCostHandler, setTargetProfitRateHandler }) => {
  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>計算機</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Calculator
          exchangeRateValue={exchangeRateValue}
          feesPercentageValue={feesPercentageValue}
          shippingCostValue={shippingCostValue}
          targetProfitRateValue={targetProfitRateValue}
          setExchangeRateHandler={setExchangeRateHandler}
          setFeesPercentageHandler={setFeesPercentageHandler}
          setShippingCostHandler={setShippingCostHandler}
          setTargetProfitRateHandler={setTargetProfitRateHandler}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalculatorModal;
