import "./style.scss";
import { memo, useEffect, useState } from "react";
import { formatter } from "utils/formater";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    note: "",
  });

  // Lấy dữ liệu giỏ hàng từ localStorage khi trang được load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Xử lý thay đổi thông tin thanh toán
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo({ ...checkoutInfo, [name]: value });
  };

  // Tính tổng tiền của giỏ hàng
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * Number(item.price || 0),
    0
  );

  // Xử lý đặt hàng
  const handleOrder = () => {
    // Kiểm tra thông tin thanh toán
    if (
      !checkoutInfo.fullName ||
      !checkoutInfo.address ||
      !checkoutInfo.phone ||
      !checkoutInfo.email
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    // Dữ liệu đơn hàng
    const orderData = {
      customerInfo: checkoutInfo,
      cartItems: cart,
      total: totalPrice,
    };

    console.log("Thông tin đặt hàng:", orderData);

    // Gửi lên API hoặc xử lý logic đặt hàng
    alert("Đặt hàng thành công!");
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout_input">
              <label>
                Họ và tên: <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={checkoutInfo.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="checkout_input">
              <label>
                Địa chỉ: <span className="required">*</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={checkoutInfo.address}
                onChange={handleChange}
              />
            </div>
            <div className="checkout_input_group">
              <div className="checkout_input">
                <label>
                  Điện thoại: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={checkoutInfo.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="checkout_input">
              <label>Ghi chú:</label>
              <textarea
                name="note"
                rows={15}
                placeholder="Nhập ghi chú"
                value={checkoutInfo.note}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="checkout_order">
              <h3>Đơn hàng</h3>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    <span>{item.TITLE}</span>
                    <b>
                      {formatter(Number(item.price || 0))} x {item.quantity} ={" "}
                      {formatter(Number(item.price || 0) * item.quantity)}
                    </b>
                  </li>
                ))}
                <li className="checkout_order_subtotal">
                  <h3>Tổng đơn:</h3>
                  <b>{formatter(totalPrice)}</b>
                </li>
              </ul>
              <button
                type="button"
                className="button-submit"
                onClick={handleOrder}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CheckoutPage);
