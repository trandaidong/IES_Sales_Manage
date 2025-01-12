import { memo, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ProductCard } from "component";

const HomePage = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [sliderItems, setSliderItems] = useState([]); // Dữ liệu slider
  const [banners, setBanners] = useState([]); // Dữ liệu banner
  const [cart, setCart] = useState([]); // Giỏ hàng

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products"); // Gọi API
        const data = await response.json();

        // Cập nhật dữ liệu slider và banner từ products
        setProducts(data.products || []); // Toàn bộ sản phẩm
        setSliderItems(data.products.slice(0, 5)); // 5 sản phẩm đầu tiên cho slider
        setBanners(data.products.slice(0, 3)); // 3 sản phẩm đầu tiên cho banner
      } catch (error) {
        console.error("Lỗi khi gọi API products:", error);
      }
    };

    fetchProducts(); // Gọi API khi component được render lần đầu
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
  
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
    const existingItemIndex = updatedCart.findIndex(
      (item) => item.TITLE === product.TITLE
    );
  
    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu chưa tồn tại, thêm sản phẩm mới và đảm bảo có 'price'
      updatedCart.push({
        TITLE: product.TITLE,
        THUMBNAIL: product.THUMBNAIL,
        price: Number(product.PRICE), // Đảm bảo giá trị là số
        quantity: 1,
      });
    }
  
    // Cập nhật giỏ hàng
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu vào localStorage
  };
  const renderFeaturedProducts = (data) => {
    const tabList = [];
    const tabPanels = [];

    const categories = ["Tất cả", "Danh mục 1", "Danh mục 2"];
    categories.forEach((category, index) => {
      tabList.push(<Tab key={index}>{category}</Tab>);

      const filteredProducts = index === 0 ? data : data.slice(0, 4);

      const tabPanel = filteredProducts.map((item, j) => (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={j}>
          <ProductCard
            name={item.TITLE}
            img={`/assets/images/${item.THUMBNAIL}`}
            price={item.PRICE}
            onAddToCart={() => handleAddToCart(item)}
          />
        </div>
      ));

      tabPanels.push(
        <TabPanel key={index}>
          <div className="row">{tabPanel}</div>
        </TabPanel>
      );
    });

    return (
      <Tabs>
        <TabList>{tabList}</TabList>
        {tabPanels}
      </Tabs>
    );
  };

  return (
    <>
      {/* Categories Slider */}
      <div className="container container_categories_slider">
        <Carousel responsive={responsive} className="categories_slider">
          {sliderItems.map((item, key) => (
            <div
              className="categories_slider_item"
              style={{
                backgroundImage: `url(/assets/images/${item.THUMBNAIL})`,
              }}
              key={key}
            >
              <p>{item.TITLE}</p>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Featured Products */}
      <div className="container">
        <div className="featured">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {products.length > 0 ? (
            renderFeaturedProducts(products)
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
        </div>
      </div>

      {/* Banner Slider */}
      <div className="container">
        <Carousel responsive={responsive} className="banner_slider">
          {banners.map((banner, index) => (
            <div className="banner_pic" key={index}>
              <img
                src={`/assets/images/${banner.THUMBNAIL}`}
                alt={`Banner ${index + 1}`}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default memo(HomePage);
