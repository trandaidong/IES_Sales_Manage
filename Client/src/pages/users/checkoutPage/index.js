import "./style.scss";
import { memo } from "react";
import { formatter } from "utils/formater";
const CheckoutPage = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className=" col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout_input">
              <label>
                Họ và tên: <span className=" required">*</span>
              </label>
              <input type="text" placeholder="Nhập họ và tên"/>
              </div>
              <div className="checkout_input">
              <label>
                Địa chỉ: <span className=" required">*</span>
              </label>
              <input type="text" placeholder="Nhập địa chỉ"/>
            </div>
            <div className="checkout_input_group">
              <div className="checkout_input">
              <label>
                Điện thoại: <span className=" required">*</span>
              </label>
              <input type="text" placeholder="Nhập số điện thoại"/>
              </div>
              <div className="checkout_input">
              <label>
                Email: <span className=" required">*</span>
              </label>
              <input type="email" placeholder="Nhập email"/>
              </div>
            </div>
            <div className="checkout_input">
              <label>Ghi chú:
                <textarea rows={15} placeholder="Nhập ghi chú"/>
              </label>
            </div>
            </div>
          <div className=" col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout_order">
              <h3>Đơn hàng</h3>
              <ul>
                <li>
                  <span> Sản phẩm 1</span>
                  <b>{formatter(100000)} (1)</b>
                </li>
                <li>
                  <span> Sản phẩm 2</span>
                  <b>{formatter(70000)} (2)</b>
                </li>
                <li>
                  <span> Sản phẩm 3</span>
                  <b>{formatter(10000)} (1)</b>
                </li>
                <li>
                  <span> Sản phẩm 4</span>
                  <b>{formatter(15000)} (2)</b>
                </li>
                <li>
                  <span> Sản phẩm 5</span>
                  <b>{formatter(20000)} (3)</b>
                </li>
                <li>
                  <h4>mã giảm giá</h4>
                  <b>SVC1156</b>
                </li>
                <li className="checkout_order_subtotal">
                  <h3> Tổng đơn</h3>
                  <b>{formatter(340000)}</b>
                </li>
              </ul>
              <button type="button" className="button-submit">Đặt hàng</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(CheckoutPage);
