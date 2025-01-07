import { memo } from "react";
import "./style.scss";

const Quantity = ({ hashAddToCart = true }) => {
  return (
    <div className="quantity-container">
      <div className="quantity">
        <span className="qtybtn">-</span>
        <input type="number" defaultValue={1}></input>
        <span className="qtybtn">+</span>
      </div>
      {hashAddToCart && (
        <button type="submit" className="button-submit">
          Thêm giỏ hàng
        </button>
      )}
    </div>
  );
};

export default memo(Quantity);
