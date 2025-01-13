// pages/users/categoryPage.js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "component";
import "./style.scss";

const CategoryPage = () => {
  const { categoryId } = useParams(); // Lấy categoryId từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();

        // Lọc sản phẩm theo CATEGORYID
        const filteredProducts = data.products.filter(
          (product) => product.CATEGORYID === categoryId
        );

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi gọi API sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container">
      <h2>Sản phẩm trong danh mục</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
              key={product.PRODUCTID}
            >
              <ProductCard
                name={product.TITLE}
                img={`/assets/images/${product.THUMBNAIL}`}
                price={product.PRICE}
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
