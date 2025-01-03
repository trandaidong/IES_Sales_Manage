import { formatter } from "utils/formater";
import "./style.scss";
import { memo } from "react";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
const ShoppingCartPage = () => {
  const navigate = useNavigate();
  return <>
    <div className="container">
      <div className="table_cart">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="shopping_cart_item">
                <img
                  src=""    
                  alt=""
                />
                <h4> ten san pham 1</h4>
              </td>
              <td> {formatter(200000)}</td>
              <td> <Quantity quantity="2" hashAddToCart={false}/></td>
              <td> {formatter(400000)}</td>
              <td className="icon_close">
                <AiOutlineClose/>
              </td>
            </tr>
            <tr>
              <td className="shopping_cart_item">
                <img
                  src=""    
                  alt=""
                />
                <h4> ten san pham 2</h4>
              </td>
              <td> {formatter(100000)}</td>
              <td> <Quantity quantity="2" hashAddToCart={false}/></td>
              <td> {formatter(200000)}</td>
              <td className="icon_close">
                <AiOutlineClose/>
              </td>
            </tr>
            <tr>
              <td className="shopping_cart_item">
                <img
                  src=""    
                  alt=""
                />
                <h4> ten san pham 3</h4>
              </td>
              <td> {formatter(10000)}</td>
              <td> <Quantity quantity="10" hashAddToCart={false}/></td>
              <td> {formatter(100000)}</td>
              <td className="icon_close">
                <AiOutlineClose/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="row">
       <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
        <div className="shopping_continue">
          <h3>Mã giảm giá</h3>
          <div className="shopping_discount">
          <input type="text" placeholder="Nhập mã giảm giá"></input>
          <button className="button-submit">Áp dụng</button>
          </div>
        </div>
       </div>
       <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
        <div className="shopping_checkout">
          <h2>Tổng đơn:</h2>
          <ul>
            <li>Số lượng: <span>{2}</span></li>
            <li>Thành tiền: <span>{formatter(700000)}</span></li>
          </ul>
          <button type="button" className="button-submit" onClick={() =>navigate(ROUTERS.USER.CHECKOUT)}>
          Thanh toán  
          </button>
        </div>
       </div>
      </div>
    </div>
    </>;
};
export default memo(ShoppingCartPage);
