import "./style.scss";
import { memo, useEffect, useState } from "react";
import Breadcrumb from "../theme/breadcrumb";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { ProductCard } from "component";

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu danh mục

  const sorts = [
    "Giá thấp đến cao",
    "Giáo cao đến thấp",
    "Mới đến cũ",
    "Cũ đến mới",
    "Bán chạy nhất",
    "Đang giảm giá",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data.products || []); // Toàn bộ sản phẩm
      } catch (error) {
        console.error("Lỗi khi gọi API products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data.categories || []); // Toàn bộ danh mục
      } catch (error) {
        console.error("Lỗi khi gọi API categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Breadcrumb name="Danh sách sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
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
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
            <div className="row">
              {products.map((item, key) => (
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key={key}>
                  <ProductCard
                    name={item.TITLE}
                    img={`/assets/images/${item.THUMBNAIL}`}
                    price={item.PRICE}
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
