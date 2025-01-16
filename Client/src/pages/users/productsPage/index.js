import "./style.scss";
import { memo, useEffect, useState } from "react";
import Breadcrumb from "../theme/breadcrumb";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { ProductCard } from "component";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const navigate = useNavigate(); // Định nghĩa navigate
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log(savedUser);
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Lấy thông tin người dùng từ localStorage
    }
    else setUser(null);
  }, []);

  let previousCookieValue = Cookies.get('search') || '';

  setInterval(() => {
    const currentCookieValue = Cookies.get('search') || '';
    if (currentCookieValue !== previousCookieValue) {
      previousCookieValue = currentCookieValue;

      // Xử lý giá trị mới của cookie tại đây
    }
  }, 1000); // Kiểm tra mỗi giây

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const keyword=previousCookieValue;
        const response = await fetch(`http://localhost:3000/client/products/search?keyword=${keyword}`); // Gọi API
        const data = await response.json();
        // Cập nhật dữ liệu slider và banner từ products
        setProducts(data.products || []); // Toàn bộ sản phẩm
        console.log(products);
      } catch (error) {
        console.error("Lỗi khi gọi API products:", error);
      }
    };

    fetchProducts(); // Gọi API khi component được render lần đầu
  }, [previousCookieValue]);
  
  const handleAddToCart = async (_user, product) => {
    if (!_user) {
      console.log("Chưa đăng nhập");
      navigate(ROUTERS.USER.AUTH); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
      return;
    }
    try {
      const userId = _user.USERID;
      await fetch(`http://localhost:3000/client/carts/create`, { // Gửi token dưới dạng tham số URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, product }),
      });
    } catch (error) {
      console.error("Lỗi khi gọi API người dùng:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          {/* <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <div className="sidebar">
              <div className="sidebar_item">
                <h2>Tìm kiếm</h2>
                <input type="text" />
              </div>
              <div className="sidebar_item">
                <h2>Mức giá</h2>
                <div className="price-range-wrap">
                  <div>
                    <p>Từ:</p>
                    <input type="number" min={0} />
                  </div>
                  <div>
                    <p>Đến:</p>
                    <input type="number" min={0} />
                  </div>
                </div>
              </div>
              <div className="sidebar_item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div
                      className={`tag ${key === 0 ? "active" : ""}`}
                      key={key}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sidebar_item">
                <h2>Thể loại khác</h2>
                <ul>
                  {categories && categories.length > 0 ? (
                    categories.map((category, key) => (
                      <li key={key}>
                        <Link to={`${ROUTERS.USER.PRODUCTS}/${category.SLUG}`}>
                          {category.TITLE}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <p>Không có danh mục nào.</p>
                  )}
                </ul>
              </div>
            </div>
          </div> */}
          <div className="container">
            <div className="product_detail_tab">
              <h4>SẢN PHẨM</h4>
            </div>
            <div className="row">
              {products.map((item, key) => (
                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={key}>
                  <ProductCard
                    id={item.PRODUCTID}
                    name={item.TITLE}
                    img={`${item.THUMBNAIL}`}
                    price={item.PRICE}
                    onAddToCart={() => handleAddToCart(user, item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductsPage);
