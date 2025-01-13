import { memo } from "react";
import "./style.scss";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { generatePath, Link } from "react-router-dom";
import { formatter } from "utils/formater";
import { ROUTERS } from "utils/router";

const ProductCard = ({ img, name, price, onAddToCart }) => {
  return (
    <div className="featured_item pl-pr-10">
      <div
        className="featured_item_pic"
        style={{
          backgroundImage: `url(${img})`,
        }}
      >
        <ul className="featured_item_pic_hover">
          <li>
            <AiOutlineEye />
          </li>
          <li onClick={onAddToCart} style={{ cursor: "pointer" }}>
            <AiOutlineShoppingCart />
          </li>
        </ul>
      </div>
      <div className="featured_item_text">
        <h6>
          <Link to={generatePath(ROUTERS.USER.PRODUCT, { id: 1 })}>{name}</Link>
        </h6>
        <h5>{formatter(price)}</h5>
      </div>
    </div>
  );
};

export default memo(ProductCard);
