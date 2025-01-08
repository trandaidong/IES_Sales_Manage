// file này dùng để hiển thị header của trang web
import { memo, useEffect, useState } from "react";
import "./style.scss";

import {
  AiOutlineDownCircle,
  AiOutlineFacebook,
  AiOutlineGlobal,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlinePhone,
  AiOutlineShoppingCart,
  AiOutlineUpCircle,
  AiOutlineUser,
} from "react-icons/ai";

import { Link, Router, useLocation } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { formatter } from "utils/formater";
import { ROUTERS } from "utils/router";
import { useNavigate } from "react-router-dom"; // Hook điều hướng

// list danh sách sản phẩm
export const categories = [
  "Thịt tươi ",
  "Rau củ",
  "Nước trái cây",
  "Trái cây",
  "Hải sản",
];

// tạo ra 1 function Header để hiển thị header của trang web
const Header = () => {
  const location = useLocation();

  const [isShowHumberger, setShowHumberger] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  // khi mình list đường dẫn thì nếu nó không có phần sau thì hiểu là nó không có homepage lý do nó bế hơn 1
  // lý do length <= 1 là vì nó sẽ lấy ra đường dẫn là / thôi
  const [categories, setCategories] = useState([]); // Danh mục lấy từ API

  const [searchQuery, setSearchQuery] = useState(""); // Dữ liệu từ input tìm kiếm
  const navigate = useNavigate(); // Hook để điều hướng

  //list menu
  const [menus, setMenus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Cửa hàng",
      path: ROUTERS.USER.PRODUCTS,
    },
    {
      name: "Sản phẩm",
      path: "",
      isShowSubmenu: false,
      child: [],
    },
    {
      name: "Bài viết",
      path: "",
    },
    {
      name: "Liên hệ",
      path: "",
    },
  ]);

  //cập nhật địa chỉ mình đang ở
  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định (làm mới trang)
    console.log("Từ khóa tìm kiếm:", searchQuery); // In từ khóa ra console
    if (!searchQuery.trim()) return; // Không làm gì nếu input rỗng
    // Điều hướng sang trang /search với từ khóa tìm kiếm qua state
    navigate(ROUTERS.USER.SEARCH, { state: { searchQuery } });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        console.log("Danh mục từ API:", data.categories); // Kiểm tra dữ liệu trả về
        setCategories(data.categories || []); // Cập nhật danh mục
      } catch (error) {
        console.error("Lỗi khi gọi API lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        // Cập nhật danh mục (child) của "Sản phẩm"
        setMenus((prevMenus) =>
          prevMenus.map((menu) =>
            menu.name === "Sản phẩm"
              ? {
                  ...menu,
                  child: data.categories.map((cat) => ({
                    name: cat.TITLE,
                    path: `/category/${cat.CATEGORYID}`,
                  })),
                }
              : menu
          )
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý toggle submenu
  const toggleSubmenu = (menuKey) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu, index) =>
        index === menuKey
          ? { ...menu, isShowSubmenu: !menu.isShowSubmenu }
          : menu
      )
    );
  };
  return (
    <>
      {/* thanh bên trái khi respnsive */}
      <div
        className={`ger_menu_overplay${isShowHumberger ? " active" : ""}`}
        onClick={() => setShowHumberger(false)}
      />
      <div
        className={`humberger_menu_wrapper${isShowHumberger ? " show" : ""}`}
      >
        <div className="header_logo">
          <h1>DUC SHOP</h1>
        </div>
        <div className="humberger_menu_cart">
          <ul>
            <li>
              <Link to={""}>
                <AiOutlineShoppingCart /> <span>1</span>
              </Link>
            </li>
          </ul>
          <div className="header_cart_price">
            Giỏ hàng: <span>{formatter(1001230)}</span>
          </div>
        </div>
        <div className="humberger_menu_widget">
          <div className="header_top_right_auth">
            <Link to={""}>
              <AiOutlineUser /> Đăng nhập
            </Link>
          </div>
        </div>
        <div className="humberger_menu_nav">
          <ul>
            {menus.map((menu, menuKey) => (
              <li key={menuKey} to={menu.path}>
                <Link
                  to={menu.path}
                  onClick={() => {
                    const newMenus = [...menus];
                    newMenus[menuKey].isShowSubmenu =
                      !newMenus[menuKey].isShowSubmenu;
                    setMenus(newMenus);
                  }}
                >
                  {menu.name}
                  {menu.child &&
                    (menu.isShowSubmenu ? (
                      <AiOutlineDownCircle />
                    ) : (
                      <AiOutlineUpCircle />
                    ))}
                </Link>
                {menu.child && (
                  <ul
                    className={`header_menu_dropdown${
                      menu.isShowSubmenu ? " show_submenu" : ""
                    }`}
                  >
                    {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`${ROUTERS.USER.PRODUCTS}/${category.SLUG}`}>
                      {category.TITLE}
                    </Link>
                  </li>
                ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="humberger_top_right_social">
          <Link to={""}>
            <AiOutlineFacebook />
          </Link>
          <Link to={""}>
            <AiOutlineInstagram />
          </Link>
          <Link to={""}>
            <AiOutlineLinkedin />
          </Link>
          <Link to={""}>
            <AiOutlineGlobal />
          </Link>
        </div>
        <div className="humberger_menu_contact">
          <ul>
            <li>
              <MdEmail /> Ducshop@gmail.com
            </li>
            <li>Miễn phí đơn từ {formatter(200000)}</li>
          </ul>
        </div>
      </div>

      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li>
                  <AiOutlineMail />
                  Duk@gmail.com
                </li>
                <li>mien phi ship don tu {formatter(200000)}</li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul>
                <li>
                  <Link to={""}>
                    <AiOutlineFacebook />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <AiOutlineInstagram />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <AiOutlineLinkedin />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <AiOutlineGlobal />
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <AiOutlineUser />
                  </Link>
                  <span>Đăng nhập</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header_logo">
              <h1>DUC SHOP</h1>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header_menu">
              <ul>
                {menus?.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu?.path}>{menu?.name}</Link>
                    {menu.child && (
                      <ul className="header_menu_dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${menuKey}-${childKey}`}>
                            <Link to={childItem.path}>{childItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header_cart">
              <div className="header_cart_price">
                <span>{formatter(1001230)}</span>
              </div>
              <ul>
                <li>
                  <Link to={ROUTERS.USER.SHOPPING_CART}>
                    <AiOutlineShoppingCart /> <span>5</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="humberger_open">
              <AiOutlineMenu onClick={() => setShowHumberger(true)} />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row hero_categories_container">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 hero_categories">
            <div
              className="hero_categories_all "
              onClick={() => setShowCategories(!isShowCategories)}
            >
              <AiOutlineMenu />
              Danh sách sản phẩm
            </div>
            {/* Hiển thị danh mục khi có dữ liệu và trạng thái bật */}
            {isShowCategories && categories.length > 0 && (
              <ul className="categories_list">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`${ROUTERS.USER.PRODUCTS}/${category.SLUG}`}>
                      {category.TITLE}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {isShowCategories && categories.length === 0 && (
              <p>Không có danh mục nào.</p>
            )}
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 hero_search_container">
            <div className="hero_search">
              <div className="hero_search_form">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Bạn đang tìm gì?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật input}
                  />
                  <button type="submit">Tìm kiếm</button>
                </form>
              </div>
              <div className="hero_search_phone">
                <div className="hero_search_phone_icon">
                  <AiOutlinePhone />
                </div>
                <div className="hero_search_phone_text">
                  <p>0656.789.456</p>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
            {isHome && (
              <div className="hero_item">
                <div className="hero_text">
                  <span>Perfectly imperfect</span>
                  <h2>
                    Simle often <br />
                    worry less
                  </h2>
                  <p>The best thing to hold onto in life is each other</p>
                  <Link to="" className="primary-btn">
                    I've been looking for the spring of my life, you just smile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Header);
