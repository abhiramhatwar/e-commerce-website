import { Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const route = useLocation();

  // Paypal config
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className='bg-image-custom'>
      <Header />
      {/* No styles for the homepage */}
      <main className={route.pathname === "/" ? "" : "container my-4"}>
        <PayPalScriptProvider options={initialOptions}>
          <Outlet />
        </PayPalScriptProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
