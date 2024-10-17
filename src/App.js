import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Terms from "./pages/Terms/Terms";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer/Disclaimer";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import ReturnAndRefund from "./pages/ReturnAndRefund/ReturnAndRefund";
import ShippingAndDelivery from "./pages/ShippingAndDelivery/ShippingAndDelivery";
import OrderCancellation from "./pages/OrderCancellation/OrderCancellation";
import Modal from "./components/Modal/Modal";
import CategoryModal from "./components/CategoryModal/CategoryModal";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import { loadTokensFromStorage, setError, setSuccess } from "./store/slice/modalSlice";
import { setUser } from "./store/slice/userSlice";
import { getTokensFromLocalStorage } from "./utils/StorageTokens";
// import Home from './pages/Home/Home';
const Home = React.lazy(() => import("./pages/Home/Home"));
const About = React.lazy(() => import("./pages/About/About"));
const Blog = React.lazy(() => import("./pages/Blog/Blog"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail/BlogDetail"));
const Faq = React.lazy(() => import("./pages/Faq/Faq"));
const Contact = React.lazy(() => import("./pages/Contact/Contact"));
const Category = React.lazy(() => import("./pages/Category/Category"));
const ProductList = React.lazy(() => import("./pages/ProductList/ProductList"));
const ProductDetail = React.lazy(() =>
  import("./pages/ProductDetail/ProductDetail")
);
const Cart = React.lazy(() => import("./pages/Cart/Cart"));
const OrderComplete = React.lazy(() =>
  import("./pages/OrderComplete/OrderComplete")
);
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const AddressModal = React.lazy(() =>
  import("./components/AddressModal/AddressModal")
);

function App() {
  const { isAddressModelOpen, error, success } = useSelector(
    (state) => state.modal
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        toast.success(success);
        setSuccess("");
      }, 1000);
    }
    if (error) {
      setTimeout(() => {
        toast.error(error);
        setError("");
      }, 1000);
    }
  }, [success, error]);

  useEffect(() => {
    // Load tokens from localStorage when the app starts
    dispatch(loadTokensFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const tokens = getTokensFromLocalStorage();
    if(tokens) {
      console.log("Access token", tokens);
      dispatch(setUser(tokens));
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="loading">
            <img src="/images/icons/LOGO.png" alt="Logo" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="terms-condition" element={<Terms />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="return-and-refund" element={<ReturnAndRefund />} />
          <Route
            path="shipping-and-delivery"
            element={<ShippingAndDelivery />}
          />
          <Route path="order-cancellation" element={<OrderCancellation />} />
          <Route path="allcategory" element={<Category />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order-complete" element={<OrderComplete />} />
          <Route path="userprofile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Modal />
      <CategoryModal />
      {isAddressModelOpen && (
        <Suspense fallback={<div>Loading Address Modal...</div>}>
          <AddressModal />
        </Suspense>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
