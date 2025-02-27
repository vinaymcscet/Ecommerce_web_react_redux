import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
const Home = React.lazy(() => import("../pages/Home/Home"));
const ReturnAndRefund = React.lazy(() => import("../pages/ReturnAndRefund/ReturnAndRefund"));
const CookiesPolicy = React.lazy(() => import("../pages/CookiesPolicy/CookiesPolicy"));
const ShippingAndDelivery = React.lazy(() => import("../pages/ShippingAndDelivery/ShippingAndDelivery"));
const OrderCancellation = React.lazy(() => import("../pages/OrderCancellation/OrderCancellation"));
const DeleteAccount = React.lazy(() => import("../pages/DeleteAccount/DeleteAccount"));
const ProtectedRoute = React.lazy(() => import("../utils/ProtectedRoute"));

const About = React.lazy(() => import("../pages/About/About"));
const Blog = React.lazy(() => import("../pages/Blog/Blog"));
const BlogDetail = React.lazy(() => import("../pages/BlogDetail/BlogDetail"));
const Faq = React.lazy(() => import("../pages/Faq/Faq"));
const Contact = React.lazy(() => import("../pages/Contact/Contact"));
const Category = React.lazy(() => import("../pages/Category/Category"));
const ProductList = React.lazy(() => import("../pages/ProductList/ProductList"));
const ProductDetail = React.lazy(() => import("../pages/ProductDetail/ProductDetail"));
const SectionDetail = React.lazy(() => import("../pages/SectionDetail/SectionDetail"));
const Cart = React.lazy(() => import("../pages/Cart/Cart"));
const OrderComplete = React.lazy(() => import("../pages/OrderComplete/OrderComplete"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Search = React.lazy(() => import("../pages/Search/Search"));
const PageNotFound = React.lazy(() => import("../pages/PageNotFound/PageNotFound"));
const Terms = React.lazy(() => import("../pages/Terms/Terms"));
const PrivacyPolicy = React.lazy(() => import("../pages/PrivacyPolicy/PrivacyPolicy"));
const Disclaimer = React.lazy(() => import("../pages/Disclaimer/Disclaimer"));
const RefundPolicy = React.lazy(() => import("../pages/RefundPolicy/RefundPolicy"));

const RoutePage = () => {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sectionDetail/:id" element={<SectionDetail />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/terms-condition" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/return-and-refund" element={<ReturnAndRefund />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
          <Route path="/order-cancellation" element={<OrderCancellation />} />
          <Route path="/allcategory" element={<Category />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-complete" element={<OrderComplete />} />
          <Route path="delete-account" element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          } />
          {/* <Route path="userprofile" element={<Profile />} /> */}
          <Route path="/userprofile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
  )
}

export default RoutePage