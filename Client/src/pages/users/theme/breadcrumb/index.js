import { memo } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";

// trang này làm cho giao diện mỗi lần ấn sản phẩm nó hiện ra
const Breadcrumb = (props) => {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb_text">
        <h2>DuwcNgyn Shop</h2>
        <div className="breadcrumb_option">
          <ul>
            <li className="link">
              <Link to={ROUTERS.USER.HOME}>Trang chủ</Link>
            </li>
            <li>{props.name}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Breadcrumb);
