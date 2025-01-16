// file này dùng để hiển thị header của trang web
import { memo, useEffect, useState, useContext } from "react";
import "./style.scss";
import Cookies from 'js-cookie';
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
// export const categories = [
//   "Thịt tươi ",
//   "Rau củ",
//   "Nước trái cây",
//   "Trái cây",
//   "Hải sản",
// ];

// tạo ra 1 function Header để hiển thị header của trang web
const Header = () => {
  const location = useLocation();

  const [isShowHumberger, setShowHumberger] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [cart, setCart] = useState(null); // Thông tin giỏ hàng

  // khi mình list đường dẫn thì nếu nó không có phần sau thì hiểu là nó không có homepage lý do nó bế hơn 1
  // lý do length <= 1 là vì nó sẽ lấy ra đường dẫn là / thôi
  const [categories, setCategories] = useState([]); // Danh mục lấy từ API
  const [setting, setSetting] = useState([]); // Danh mục lấy từ API
  const [searchQuery, setSearchQuery] = useState(""); // Dữ liệu từ input tìm kiếm
  const navigate = useNavigate(); // Hook để điều hướng

  //list menu
  const [menus, setMenus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    // {
    //   name: "Cửa hàng",
    //   path: ROUTERS.USER.PRODUCTS,
    // },
    {
      name: "Sản phẩm",
      path: ROUTERS.USER.PRODUCTS,
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

  // Lấy dữ liệu người dùng từ localStorage khi component được mount
  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser)); // Lấy thông tin người dùng từ localStorage
      } else {
        setUser(null);
      }
    };

    fetchUser();
    // Cleanup function để dọn dẹp các hiệu ứng hoặc sự kiện khi component bị unmount
    return () => {
      // Dọn dẹp các hiệu ứng hoặc sự kiện nếu có
    };
  }, []);

  //cập nhật địa chỉ mình đang ở
  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);

    // Cleanup function để dọn dẹp các hiệu ứng hoặc sự kiện khi component bị unmount
    return () => {
      // Dọn dẹp các hiệu ứng hoặc sự kiện nếu có
    };
  }, [location]);


  // Xử lý đăng xuất
  const handleLogout = () => {
    Cookies.remove('tokenUser');
    setUser(null);
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định (làm mới trang)
    const formData = new FormData(e.target); // Lấy dữ liệu từ form
    const keyword = formData.get("keyword"); // Lấy giá trị từ input có name="keyword"
  
    if (!keyword.trim()) {
      Cookies.remove('search');
      alert("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }
  
    console.log("Từ khóa tìm kiếm:", keyword);
    Cookies.set('search', keyword);
    setTimeout(() => {
      Cookies.remove('search');
      console.log("Cookie đã bị xóa sau 10 giây.");
    }, 1000);
    navigate('/san-pham')
    // try {
    //   const response = await fetch( `http://localhost:3000/client/products/search?keyword=${keyword}`, { // Gửi token dưới dạng tham số URL
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    //   const data = await response.json();
    //   console.log(data.products)
    // } catch (error) {
    //   console.error("Lỗi khi gọi API người dùng:", error);
    // }
  };

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/client/home");
        const data = await response.json();
        setCategories(data.categories || []); // Cập nhật danh mục
        setSetting(data.setting || []); // Cập nhật setting
      } catch (error) {
        console.error("Lỗi khi gọi API lấy danh mục:", error);
      }
    };

    fetchCategories();
    // Cleanup function để dọn dẹp các hiệu ứng hoặc sự kiện khi component bị unmount
    return () => {
      // Dọn dẹp các hiệu ứng hoặc sự kiện nếu có
    };
  }, []);


  // Xử lý toggle submenu
  // const toggleSubmenu = (menuKey) => {
  //   setMenus((prevMenus) =>
  //     prevMenus.map((menu, index) =>
  //       index === menuKey
  //         ? { ...menu, isShowSubmenu: !menu.isShowSubmenu }
  //         : menu
  //     )
  //   );
  // };
  //search suggest
  const boxSearch = document.querySelector(".hero_search_form");
  if (boxSearch) {
    const input = boxSearch.querySelector('input[name="keyword"]');
    const boxSuggest = boxSearch.querySelector(".inner-suggest");

    input.addEventListener("keyup", () => {
      const keyword = input.value;
      // Tạo API và fetch
      const link = `http://localhost:3000/client/products/search?keyword=${keyword}`;

      fetch(link)
        .then(res => res.json())
        .then(data => {
          const productSearch = data.products;
          if (productSearch.length > 0) {
            boxSuggest.classList.add("show");
            const htmls = productSearch.map(product => {
              return `
                  <a class="inner-item" href="/songs/detail/${product.PRODUCTID}">
                      <div class="inner-image">
                          <img src=${product.THUMBNAIL}>
                      </div>
                      <div class="inner-info">
                          <div class="inner-title">${product.TITLE} </div>
                          <div class="inner-singer">
                              <i class="fa-solid fa-microphone-lines"></i> ${product.PRICE} </div>
                          </div>
                  </a>
              `
            })
            const boxList = boxSuggest.querySelector(".inner-list");
            boxList.innerHTML = htmls.join("");
          }
          else {
            boxSuggest.classList.remove("show");
          }
        })
    })
  }
  // end search suggest
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
          <h1>{setting.WEBNAME}</h1>
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
            Giỏ hàng: <span>{formatter(10023532)}</span>
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
                    className={`header_menu_dropdown${menu.isShowSubmenu ? " show_submenu" : ""
                      }`}
                  >
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link to={`${ROUTERS.USER.CATEGORY.replace(":categoryId", category.CATEGORYID)}`}>
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
              <MdEmail /> {setting.EMAIL}
            </li>
            <li>Miễn phí đơn từ {formatter(200000)}</li>
          </ul>
        </div>
      </div>

      {/* Hết thanh bên trái khi respnsive */}
      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li>
                  <AiOutlineMail />
                  {setting.EMAIL}
                </li>
                <li>{setting.TITLE}</li>
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
                {user ? (
                  <li>
                    <Link to={ROUTERS.USER.AUTH}>
                      <AiOutlineUser />
                    </Link>
                    <button onClick={handleLogout}>
                      <span>Đăng xuất</span>
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link to={ROUTERS.USER.AUTH}>
                      <AiOutlineUser />
                      <span>Đăng nhập</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header_logo">
              <h1>{setting.WEBNAME}</h1>
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
          {user ? (
            <div className="col-lg-3">
              <div className="header_cart">
                <div className="header_cart_price">
                  <span>{formatter(user.CART.TOTALPRICE)}</span>
                </div>
                <ul>
                  <li>
                    <Link to={ROUTERS.USER.SHOPPING_CART}>
                      <AiOutlineShoppingCart /> <span>{user.CART.TOTALQUANTITY}</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="humberger_open">
                <AiOutlineMenu onClick={() => setShowHumberger(true)} />
              </div>
            </div>
          ) : <div></div>}
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
              Danh sách danh mục
            </div>
            {isShowCategories && categories.length > 0 && (
              <ul className="categories_list">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`${ROUTERS.USER.CATEGORY.replace(":categoryId", category.CATEGORYID)}`}>
                      {category.TITLE}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 hero_search_container">
            <div className="hero_search">
              <div className="hero_search_form">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Bạn đang tìm gì?"
                    name="keyword"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật input}
                  />
                  <button type="submit">Tìm kiếm</button>
                </form>
                <div className="inner-suggest">
                  <div className="inner-list">
                  </div>
                </div>
              </div>

              <div className="hero_search_phone">
                <div className="hero_search_phone_icon">
                  <AiOutlinePhone />
                </div>
                <div className="hero_search_phone_text">
                  <p>{setting.PHONE}</p>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
            {isHome && (
              <div className="hero_item">
                <div className="hero_text">
                  <span>Sản phẩm chất lượng cao</span>
                  <h2>
                    Thoải mái lựa chọn <br />
                    Luôn an tâm
                  </h2>
                  <p>Đồng hành cùng bạn mọi lúc, mọi nơi</p>
                  <Link to="" className="primary-btn">
                    Khám phá những sản phẩm phù hợp với bạn
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
