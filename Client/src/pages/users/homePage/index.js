// trang này dùng để hiển thị trang chủ của người dùng
import { memo } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cat1Img from "assets/users/images/categories/cat-1.jpg";
import cat2Img from "assets/users/images/categories/cat-2.jpg";
import cat3Img from "assets/users/images/categories/cat-3.jpg";
import cat4Img from "assets/users/images/categories/cat-4.jpg";
import cat5Img from "assets/users/images/categories/cat-5.jpg";
import banner1Img from "assets/users/images/banner/banner-1.jpg";
import banner2Img from "assets/users/images/banner/banner-2.jpg";
import "./style.scss";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ProductCard } from "component";
import { featProducts } from "utils/common";

const HomePage = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const sliderItems = [
    {
      bgImg: cat1Img,
      name: "Fedamancy",
    },
    {
      bgImg: cat2Img,
      name: "Solitude",
    },
    {
      bgImg: cat3Img,
      name: "Opacarophile",
    },
    {
      bgImg: cat4Img,
      name: "Flechazo",
    },
    {
      bgImg: cat5Img,
      name: "Senendipity",
    },
  ];

  const renderFeaturedProducts = (data) => {
    const tabList = [];
    const tabPanels = [];

    // object.keys(data) trả về mảng các key của object, các key như là all, hehe
    Object.keys(data).forEach((key, index) => {
      tabList.push(<Tab key={index}> {data[key].tittle} </Tab>);

      const tabPanel = [];
      data[key].products.forEach((item, j) => {
        tabPanel.push(
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={j}>
            <ProductCard name={item.name} img={item.img} price={item.price} />
          </div>
        );
      });
      tabPanels.push(tabPanel);
    });
    return (
      <Tabs>
        <TabList>{tabList}</TabList>
        {tabPanels.map((item, key) => (
          //map có tác dụng duyệt qua mảng tabPanel để render ra các tabPanel, tabPanel là các sản phẩm như hình ảnh, tên, giá
          <TabPanel key={key}>
            <div className="row">{item}</div>
          </TabPanel>
        ))}
      </Tabs>
    );
  };
  return (
    <>
      {/*Categories Begin*/}
      <div className="container container_categories_slider">
        <Carousel responsive={responsive} className="categories_slider">
          {sliderItems.map((item, key) => (
            <div
              className="categories_slider_item"
              style={{ backgroundImage: `url(${item.bgImg})` }}
              key={key}
            >
              <p>{item.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
      {/*Categories End*/}

      {/*Featured Begin */}
      <div className="container">
        <div className="featured">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          {renderFeaturedProducts(featProducts)}
        </div>
      </div>
      {/*Featured End */}

      {/* Banner Begin */}
      <div className="container">
        <div className="banner">
          <div className="banner_pic">
            <img src={banner1Img} alt="bannner" />
          </div>
          <div className="banner_pic">
            <img src={banner2Img} alt="bannner" />
          </div>
        </div>
      </div>

      {/* Banner End  */}
    </>
  );
};

export default memo(HomePage);
