import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import App from "./App.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ManageProducts from "./components/ManageProducts.jsx";
import AdminStatus from "./components/AdminStatus.jsx";
import ManageOrders from "./components/ManageOrders.jsx";
import ManageUsers from "./components/ManagerUsers.jsx";
import Cart from "./pages/Cart.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import UserOrders from "./pages/UserOrders.jsx";
import Checkout from "./components/Checkout.jsx";
import OrderDetails from "./components/OrderDetails.jsx";
import SearchResults from "./components/SearchResults.jsx";

const router = createBrowserRouter([
  // Main website
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order/:id",
        element: <OrderDetails />,
      },
      {
        path: "search",
        element: <SearchResults />,
      },

      // User Dashboard
      {
        path: "user",
        children: [
          {
            path: "",
            element: <UserDashboard />,
          },
          {
            path: "orders",
            element: <UserOrders />,
          },
        ],
      },

      // Admin Dashboard
      {
        path: "admin",
        element: <AdminPanel />,
        children: [
          {
            path: "",
            element: <AdminStatus />,
          },
          {
            path: "products",
            element: <ManageProducts />,
          },
          {
            path: "orders",
            element: <ManageOrders />,
          },
          {
            path: "users",
            element: <ManageUsers />,
          },
        ],
      },
    ],
  },
]);

export default router;
