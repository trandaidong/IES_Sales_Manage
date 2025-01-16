// pages/users/categoryPage.js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "component";
import "./style.scss";
import { ROUTERS } from "utils/router";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const { categoryId } = useParams(); // Lấy categoryId từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/client/categories/products/${categoryId}`);
        const data = await response.json();

        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi gọi API sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

  const handleAddToCart = async (_user, product) => {
    if (!_user) {
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
  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container">
      <div className="product_detail_tab">
          <h4>SẢN PHẨM DANH MỤC</h4>
        </div>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
              key={product.PRODUCTID}
            >
              <ProductCard
                id={product.PRODUCTID}
                name={product.TITLE}
                img={`${product.THUMBNAIL}`}
                price={product.PRICE}
                onAddToCart={() => handleAddToCart(user, product)}
              />
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
