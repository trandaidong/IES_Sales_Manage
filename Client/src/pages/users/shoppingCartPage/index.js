import { formatter } from "utils/formater";
import "./style.scss";
import { memo, useEffect, useState, useContext } from "react";
import { Quantity } from "component";
import { AiOutlineClose } from "react-icons/ai";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";

const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // Định nghĩa navigate
  const [user, setUser] = useState(null); // Lấy thông tin người dùng từ UserContext
  const [checkoutInfo, setCheckoutInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
  });
  // Lấy giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log(savedUser);
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Lấy thông tin người dùng từ localStorage
    }
    else setUser(null);
  }, []);

  // if (!user) return null; // Nếu không có thông tin người dùng thì không hiển thị g
  useEffect(() => {
    if (user) {
      const userId = user.USERID;
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:3000/client/carts/index/${userId}`, { // Gửi token dưới dạng tham số URL
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const data = await response.json();
          setCart(data.cart);
        } catch (error) {
          console.error("Lỗi khi gọi API người dùng:", error);
        }
      };

      fetchCart();
    }
  }, [user]);

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/client/carts/delete/${id}`, { // Gửi token dưới dạng tham số URL
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setCart(data.cart);
      console.log(cart)
    } catch (error) {
      console.error("Lỗi khi gọi API người dùng:", error);
    }
  };
  const handleQuantityChange = async (cartId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:3000/client/carts/update/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        console.log(cart)
      } else {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // Xử lý giỏ hàng
  // Xử lý thay đổi thông tin thanh toán
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo({ ...checkoutInfo, [name]: value });
  };
  const totalPrice =cart.reduce((acc, item) => acc + (item.PRICE * (1 - item.DISCOUNT) * item.QUANTITY), 0).toFixed(0);
  const handleOrder = async () => {
    // Kiểm tra thông tin thanh toán
    if(cart.length==0){
      alert("Chưa có sản phẩm!");
      return;
    }
    if (
      !checkoutInfo.fullName ||
      !checkoutInfo.address ||
      !checkoutInfo.phone
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
    const userId=user.USERID;
    const response = await fetch(`http://localhost:3000/client/orders/create/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if(response.ok){
      alert("Đặt hàng thành công!");
      navigate('/')
    }
    else {
      alert("Đặt hàng thất bại!");
    }
    // Gửi lên API hoặc xử lý logic đặt hàng
  };

  return (
    <>
      <div className="container">
        <div className="table_cart">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="shopping_cart_item">
                    <img
                      src={`${item.THUMBNAIL}`}
                      alt={item.TITLE}
                    />
                  </td>
                  <td><Link to={generatePath(ROUTERS.USER.PRODUCT, { id: item.PRODUCTID })}>{item.TITLE}</Link></td>
                  {/* Hiển thị giá */}
                  <td>{formatter(Number(item.PRICE))}</td>
                  <td>{(item.DISCOUNT) * 100}%</td>
                  {/* Hiển thị số lượng */}
                  <td>
                    <span className="quantity">
                      <input
                        type="number"
                        defaultValue={item.QUANTITY}
                        min="1"
                        onChange={(e) => handleQuantityChange(item.CARTID, e.target.value)}>
                      </input>
                    </span>
                  </td>
                  {/* Hiển thị thành tiền */}
                  <td>{formatter(item.QUANTITY * item.PRICE * (1 - item.DISCOUNT))}</td>
                  <td className="icon_close">
                    <AiOutlineClose onClick={() => handleRemoveItem(item.CARTID)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="product_detail_tab">
          <h4>ĐẶT HÀNG</h4>
        </div>
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
            <div className="shopping_checkout">
              <h2>Tổng đơn:</h2>
              <ul>
                <li>
                  Số lượng: <span>{cart.reduce((acc, item) => acc + item.QUANTITY, 0)}</span>
                </li>
                <li>
                  Thành tiền: <span>{formatter(totalPrice)}</span>
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

export default memo(ShoppingCartPage);
