import { memo, useEffect, useState ,useContext} from "react";
import { useNavigate } from 'react-router-dom';
import "react-multi-carousel/lib/styles.css";
import "./style.css";
import Cookies from 'js-cookie';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Sử dụng hook useNavigate

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMessage('');
  //   }, 3000);

  //   // Hàm cleanup để xóa timer khi component unmount
  //   return () => clearTimeout(timer);
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/client/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Đăng nhập thành công:', data);

      Cookies.set('tokenUser', data.user.USERID); // Lưu id vào cookie
      localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin người dùng vào localStorage
      // setUser(data.user); // Lưu dữ liệu người dùng vào Context
      navigate('/'); // Chuyển hướng tới trang home
    } else {
      // Xử lý khi đăng nhập thất bại
      console.error('Đăng nhập thất bại:', data);
      setMessage(data.message); // Lưu thông báo lỗi vào state

      // Đặt thời gian để xóa thông báo sau 3 giây
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div class="body_login">
      <div className="login-container">
        <h1>KHÁCH HÀNG</h1>
        <p>Chào mừng bạn quay trở lại</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">Đăng nhập</button>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="footer">
          <p> &copy; Digital nomad
            <a href="/client/auth/password/forgot"> Quên mật khẩu? </a>
          </p>
          <p> Bạn chưa có tài khoản?
            <a href="/client/auth/register">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;