// nó sẽ là quản lý các trang kiểu con đường
// code tạo ra 1 function renderUserRouter để tạo ra 1 mảng userRouter chứa các object có key là path và Component
// có ý nghĩa là tạo ra đường dẫn
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ROUTERS } from "./utils/router";
import Masterlayout from "./pages/users/theme/masterlayout";
import AuthLayout from './pages/users/theme/authLayout';
import ProfilePage from "./pages/users/profilePage";
import ProductsPage from "./pages/users/productsPage";
import ProductDetailPage from "./pages/users/productDetailPage";
import ShoppingCartPage from "pages/users/shoppingCartPage";
import CheckoutPage from "pages/users/checkoutPage";
import SearchPage from "pages/users/searchPage";
import CategoryPage from "pages/users/categoryPage";
import AuthPage from "pages/users/authPage";

// Path: shop_ban_hang/src/router.js
// tao ra 1 function renderUserRouter de tao ra 1 mang userRouter chua cac object co key la path va Component
// tạo ra đường dẫn
const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
    },
    {
      path: ROUTERS.USER.PRODUCTS,
      component: <ProductsPage />,
    },
    {
      path: ROUTERS.USER.PRODUCT,
      component: <ProductDetailPage />,
    },
    {
      path: ROUTERS.USER.SHOPPING_CART,
      component: <ShoppingCartPage />,
    },
    {
      path: ROUTERS.USER.CHECKOUT,
      component: <CheckoutPage />,
    },
    {
      path: ROUTERS.USER.SEARCH,
      component: <SearchPage />,
    },
    {
      path: ROUTERS.USER.CATEGORY, // Thêm đường dẫn Category
      component: <CategoryPage />,
    },
    {
      path: ROUTERS.USER.AUTH,
      component: <AuthPage />,
    },
  ];

  const authRouters = [
    {
      path: ROUTERS.USER.AUTH,
      component: <AuthPage />,
    },
  ];

  // khi mà có component ở trên thì nó sẽ kế thùa thằng return ở dưới là Masterlayout
  return (
    <Routes>
      {/* Route cho trang đăng nhập */}
      {/* {authRouters.map((item, key) => (
        <Route
          key={key}
          path={item.path}
          element={
            <AuthLayout>
              {item.component}
            </AuthLayout>
          }
        />
      ))} */}
      {/* Các route khác với Masterlayout */}
      {userRouters.map((item, key) => (
        <Route
          key={key}
          path={item.path}
          element={
            item.path === ROUTERS.USER.AUTH ? (
              <AuthLayout>{item.component}</AuthLayout>
            ) : (
              <Masterlayout>{item.component}</Masterlayout>
            )
          }
        />
      ))}
    </Routes>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};
export default RouterCustom;
