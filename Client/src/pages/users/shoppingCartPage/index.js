import { formatter } from "utils/formater";
import "./style.scss";
import { memo, useEffect, useState } from "react";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";

const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // Định nghĩa navigate

  // Lấy giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật localStorage
  };

  // Tính tổng số lượng và tổng tiền
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <>
      <div className="container">
        <div className="table_cart">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
  {cart.map((item, index) => (
    <tr key={index}>
      <td className="shopping_cart_item">
        <img
          src={`/assets/images/${item.THUMBNAIL}`}
          alt={item.TITLE}
        />
        <h4>{item.TITLE}</h4>
      </td>
      {/* Hiển thị giá */}
      <td>{formatter(Number(item.price))}</td>
      {/* Hiển thị số lượng */}
      <td>
      <span>{item.quantity}</span>
      </td>
      {/* Hiển thị thành tiền */}
      <td>{formatter((Number(item.price) || 0) * item.quantity)}</td>
      <td className="icon_close">
        <AiOutlineClose onClick={() => handleRemoveItem(index)} />
      </td>
    </tr>
  ))}
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
                <li>
                  Số lượng: <span>{totalQuantity}</span>
                </li>
                <li>
                  Thành tiền: <span>{formatter(totalPrice)}</span>
                </li>
              </ul>
              <button
                type="button"
                className="button-submit"
                onClick={() => navigate(ROUTERS.USER.CHECKOUT)}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ShoppingCartPage);
