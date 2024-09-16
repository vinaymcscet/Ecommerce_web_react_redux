import { Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
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

import './App.css';
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import Faq from "./pages/Faq/Faq";
import Contact from "./pages/Contact/Contact";
import Category from "./pages/Category/Category";
import ProductList from "./pages/ProductList/ProductList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import AddressModal from "./components/AddressModal/AddressModal";
import { useSelector } from "react-redux";
import OrderComplete from "./pages/OrderComplete/OrderComplete";
import Profile from "./pages/Profile/Profile";

function App() {
  const { isAddressModelOpen } = useSelector((state) => state.modal);
  return (
    <div className="App">
      <Header />
      <ScrollToTop />
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
          <Route path="shipping-and-delivery" element={<ShippingAndDelivery />} />
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
      <Footer />
      <Modal />
      <CategoryModal />
      {isAddressModelOpen && (
      <AddressModal />
      )}
    </div>
  );
}

export default App;
