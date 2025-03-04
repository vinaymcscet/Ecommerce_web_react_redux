/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setChangePassword } from "../../store/slice/userSlice";
import "./Profile.css";
import InputField from "../../components/InputBox/InputBox";
import { 
    CONFIRM_PASSWORD, 
    CONFIRM_PASSWORD_LABEL, 
    NEW_PASSWORD, 
    NEW_PASSWORD_ENTER, 
    NEW_PASSWORD_LABEL, 
    OLD_PASSWORD, 
    OLD_PASSWORD_ENTER, 
    OLD_PASSWORD_LABEL, 
    PASSWORD, 
    PASSWORD_NOT_MATCH_ERROR, 
    PASSWORD_TYPE 
  } from "../../utils/Constants";
import { 
    changePasswordRequest, 
    getListAddress, 
    getListOfWhistListData, 
    getOfferList, 
    getUserRequest, 
    getUserReviewProductData, 
    OrderListData, 
    updateProfileRequest, 
} from "../../store/slice/api_integration";
import Notifications from "../Notifications/Notifications";
import { CircularProgress } from "@mui/material";
import Wishlist from "../Wishlist/Wishlist";
import Coupens from "../Coupens/Coupens";
import Reviews from "../Reviews/Reviews";
import { setOrderListResponse } from "../../store/slice/cartSlice";
import DeliveredOrders from "../DeliveredOrders/DeliveredOrders";
import ReturnOrders from "../ReturnOrders/ReturnOrders";
import CancelledOrders from "../CancelledOrders/CancelledOrders";
import ActiveOrders from "../ActiveOrders/ActiveOrders";
import Address from "../Address/Address";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeOrderTab, setActiveOrderTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(0);  // Default page 0 (first page)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [wishListPage, setWishListPage] = useState(0);  // Default page 0 (first page)
  const [wishListItemsPerPage, setWishListItemsPerPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(0);  // Default page 0 (first page)
  const [activePage, setActivePage] = useState(0);  // Default page 0 (first page)
  const [activeItemsPerPage, setActiveItemsPerPage] = useState(10);
  const [returnPage, setReturnPage] = useState(0);  // Default page 0 (first page)
  const [returnItemsPerPage, setReturnItemsPerPage] = useState(10);
  const [cancelPage, setCancelPage] = useState(0);  // Default page 0 (first page)
  const [cancelItemsPerPage, setCancelItemsPerPage] = useState(10);
  const [deliveredPage, setDeliveredPage] = useState(0);  // Default page 0 (first page)
  const [deliveredItemsPerPage, setDeliveredItemsPerPage] = useState(10);
  
  // const [activeOrderIndex, setActiveOrderIndex] = useState(null);
  // const [returnOrderIndex, setReturnOrderIndex] = useState(null);
  // const [cancelOrderIndex, setCancelOrderIndex] = useState(null);
  // const [deliveredOrderIndex, setDeliveredOrderIndex] = useState(null);
  const [activeOrderLoading, setActiveOrderLoading] = useState(false);
  const [returnOrderLoading, setReturnOrderLoading] = useState(false);
  const [cancelledOrderLoading, setCancelledOrderLoading] = useState(false);
  const [deliveredOrderLoading, setDeliveredOrderLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const { user, changePassword } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.modal);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { profile_pic, email, mobile } = user[0]?.data || {};
  const fullname = user[0]?.data?.first_name + " " + user[0]?.data?.last_name;
  
  const [errorFileType, setErrorFileType] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Function to handle image upload and preview
  const handleImageUpload = (e) => {
    setErrorFileType("");
    const file = e.target.files[0]; // Get the uploaded file

    if (file && file.type.startsWith("image/")) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageFile(file);
    } else {
      setErrorFileType("Please upload a valid image file");
    }
  };

  useEffect(() => {
    console.log("user", user);
    if(user.length > 0) dispatch(getUserRequest());
    else navigate("/");
  }, [])

// ==============================================================
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState(""); // Error for new password
const [confirmPasswordError, setConfirmPasswordError] = useState("");
const [isPasswordValid, setIsPasswordValid] = useState(true);

const validatePasswordLength1 = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
const handleFormPasswordChange = (e) => {
  const newPassword = e.target.value;
  setPassword(newPassword);
  
  if (!validatePasswordLength1(newPassword)) {
    setPasswordError(PASSWORD);
    setIsPasswordValid(false);
  } else {
    setPasswordError("");
    setIsPasswordValid(true);
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError(PASSWORD_NOT_MATCH_ERROR);
    } else {
      setConfirmPasswordError("");
    }
  }
  dispatch(setChangePassword({ newPassword: newPassword }));
};

const handleConfirmPasswordChange = (e) => {
  const confirmPasswordValue = e.target.value;
  setConfirmPassword(confirmPasswordValue);

  // Check if passwords match
  if (confirmPasswordValue !== password) {
    setConfirmPasswordError(PASSWORD_NOT_MATCH_ERROR);
  } else {
    setConfirmPasswordError("");
  }
  dispatch(setChangePassword({ confirmPassword: confirmPasswordValue }));
};

const handlePasswordUpdateSubmit = (e) => {
  e.preventDefault();
  
  if (isPasswordValid && password === confirmPassword) {
   
    const responseObj = {
      old_password: changePassword.oldPassword,
      new_password: changePassword.newPassword,
      confirm_password: changePassword.confirmPassword,
    }
    dispatch(changePasswordRequest(responseObj)).finally(() => {
      dispatch(getUserRequest())
    });
    setPassword("");
    setConfirmPassword("");
    dispatch(setChangePassword({ oldPassword: "", newPassword: "", confirmPassword: "" }))
    // Handle form submission
  } 
};
// ==============================================================

  const [formData, setFormData] = useState({
    fullName: fullname || "",
    email: email || "",
    phone: mobile || "",
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (user && user[0]) {
      setFormData({
        fullName: fullname || "",
        email: email || "",
        phone: mobile || "",
      });
    }
  }, [user, fullname, email, mobile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (/^\d+$/.test(value) && !value.startsWith("+44")) {
      updatedValue = `+44${value}`;
      setFormData({ ...formData, [name]: updatedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setErrors({ ...errors, [name]: "" });
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
    }

    // Validate email format
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Ensure phone number is exactly 10 digits
    if (!formData.phone || !/^\+44\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be in the format +44XXXXXXXXXX (UK format).";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      // dispatch(setUser(formData));
      const [firstName, ...restName] = formData.fullName.trim().split(" ");
      const lastName = restName.join(" ");
      const responseObj = {
        first_name: firstName,
        last_name: lastName,
        mobile: formData.phone,
        email: formData.email,
        profile_pic: imageFile
      }
      dispatch(updateProfileRequest(responseObj)).finally(() => {
        dispatch(getUserRequest())
      });
    } else {
      setErrors(newErrors);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setChangePassword({ ...changePassword, [name]: value }));
  };

  const validatePasswordLength = (value) => {
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  return passwordRegex.test(value)
    ? ""
    : PASSWORD;
  };
  
  const handleActiveTabs = (value) => {
    const searchParams = new URLSearchParams(location.search);
    // Clear query parameters for cleaner URL
    if (value !== 2 && value !== 5) {
      navigate(location.pathname); // Reset URL without parameters
    }
    if (value === 2) {
      setAddressLoading(true);
      navigate(location.pathname);
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      setPage(pageParam - 1); // Set initial page based on URL
  
      const offset = (pageParam - 1) * itemsPerPage; // Adjust offset
      const limit = itemsPerPage;
  
      const responseObj = {
        offset,
        limit,
      };
      dispatch(getListAddress(responseObj)).finally(() => {
        setAddressLoading(false);
      });
    }
    if (value === 4) {
      dispatch(getOfferList());
    }
    if (value === 5) {
      navigate(location.pathname);
      const pageParam = parseInt(searchParams.get('wishListPage'), 10) || 1;
      setWishListPage(pageParam - 1); // Set initial page based on URL
  
      const offset = (pageParam - 1) * wishListItemsPerPage; // Adjust offset
      const limit = wishListItemsPerPage;
  
      const responseObj = {
        offset,
        limit,
      };
      dispatch(getListOfWhistListData(responseObj));
    }
    if (value === 3) {
      navigate(location.pathname);
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      setReviewPage(pageParam - 1); // Set initial page based on URL
  
      const offset = (pageParam - 1) * itemsPerPage; // Adjust offset
      const limit = itemsPerPage;
  
      const responseObj = {
        offset,
        limit,
      };
      dispatch(getUserReviewProductData(responseObj));
    }
    if ( value === 1) {
      setActiveOrderLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const pageParam = parseInt(searchParams.get("page"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || activeItemsPerPage;
    
      // Update state with URL parameters
      setActivePage(pageParam - 1); // Sync pagination (0-based indexing)
      setActiveItemsPerPage(itemsPerPageParam);
    
      // Calculate offset and limit dynamically
      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;
    
      // Dispatch the API call with updated parameters
      const responseObj = {
        status: 1,
        offset,
        limit
      }
      dispatch(OrderListData(responseObj)).finally(() => {
        setActiveOrderLoading(false);
      });
    }
    setActiveTab(value); // Update active tab
  };
  // =========================================================

    const handleActiveOrderTab = (value) => {
      // status - 1 for Active Order
      if(value === 0) {
        // setActiveOrderIndex(null);
        // setReturnOrderIndex(null);
        // setCancelOrderIndex(null);
        // setDeliveredOrderIndex(null);
        setActiveOrderLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || activeItemsPerPage;
      
        // Update state with URL parameters
        setActivePage(pageParam - 1); // Sync pagination (0-based indexing)
        setActiveItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        // Dispatch the API call with updated parameters
        const responseObj = {
          status: 1,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj)).finally(() => {
          setActiveOrderLoading(false);
        });
      }
      // status - 5 for Delivered Order
      if(value === 1) {
        // setActiveOrderIndex(null);
        // setReturnOrderIndex(null);
        // setCancelOrderIndex(null);
        // setDeliveredOrderIndex(null);
        dispatch(setOrderListResponse(null))
        setDeliveredOrderLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || deliveredItemsPerPage;
      
        // Update state with URL parameters
        setDeliveredPage(pageParam - 1); // Sync pagination (0-based indexing)
        setDeliveredItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
      
        const responseObj = {
          status: 5,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj)).finally(() => {
          setDeliveredOrderLoading(false);
        });
      }
      // status - 6 for Return Order
      if(value === 2) {
        // setActiveOrderIndex(null);
        // setReturnOrderIndex(null);
        // setCancelOrderIndex(null);
        // setDeliveredOrderIndex(null);
        setReturnOrderLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || returnItemsPerPage;
      
        // Update state with URL parameters
        setReturnPage(pageParam - 1); // Sync pagination (0-based indexing)
        setReturnItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        const responseObj = {
          status: 6,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj)).finally(() => {
          setReturnOrderLoading(false);
        });
      }
      // status - 3 for Cancel Order
      if(value === 3) {
        // setActiveOrderIndex(null);
        // setReturnOrderIndex(null);
        // setCancelOrderIndex(null);
        // setDeliveredOrderIndex(null);
        // setCancelledOrderLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || cancelItemsPerPage;
      
        // Update state with URL parameters
        setCancelPage(pageParam - 1); // Sync pagination (0-based indexing)
        setCancelItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
        const responseObj = {
          status: 3,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj)).finally(() => {
          setCancelledOrderLoading(false);
        });
      }
      setActiveOrderTab(value);
    }
    const baseUrl = window.origin;
    return (
    <div className="userProfile">
      <Helmet>
          <title>{'Your Profile | Manage Account & Orders | FikFis'}</title>
          <meta name="description" content={"Access and manage your FikFis account, track orders, update details, and personalize your shopping experience—all in one place."} />
          <meta name="keywords" content={'Your Profile | Manage Account & Orders | FikFis'} />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:title" content={'Your Profile | Manage Account & Orders | FikFis'} />
          <meta property="og:description" content={"Access and manage your FikFis account, track orders, update details, and personalize your shopping experience—all in one place."} />
          <meta property="og:image" content={`${baseUrl}/images/icons/LOGO1.png`} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="article" />
          {/* <!-- Twitter --> */}  
          <meta property="twitter:card" content="article" />
          <meta property="twitter:url" content={window.location.href} />
          <meta property="twitter:title" content={'Your Profile | Manage Account & Orders | FikFis'} />
          <meta property="twitter:description" content={"Access and manage your FikFis account, track orders, update details, and personalize your shopping experience—all in one place."} />
          <meta property="twitter:image" content={`${baseUrl}/images/icons/LOGO1.png`} />
      </Helmet>
      <h1>Your Profile</h1>
      <div className="vertical-tabs-container">
        <div className="tabs">
          <div className="profile_user_image">
            <img src={(imagePreview ? imagePreview : profile_pic) || '/images/icons/avtar1.png'} alt={fullname} />
            <div className="editMode">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <img src={'/images/icons/edit.svg'} alt={'edit icon'} />
            </div>
          </div>
          {errorFileType && <div className="error errorImageType">{errorFileType}</div>}
          <p>{user[0]?.fullname? user[0]?.fullname.slice(0, 15) : ''}</p>
          <div className="email">{email}</div>
          <div
            className={`tab ${activeTab === 0 ? "active" : ""}`}
            onClick={() => handleActiveTabs(0)}
          >
            <img src="/images/profile/user1.svg" alt="Login" />
            <span>Login and Security</span>
          </div>
          <div
            className={`tab ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleActiveTabs(1)}
          >
            <img src="/images/profile/orders.svg" alt="Your Orders" />
            <span>Your Orders</span>
          </div>
          <div
            className={`tab ${activeTab === 2 ? "active" : ""}`}
            onClick={() => handleActiveTabs(2)}
          >
            <img src="/images/profile/address.svg" alt="Your Address" />
            <span>Your Address</span>
          </div>
          <div
            className={`tab ${activeTab === 3 ? "active" : ""}`}
            onClick={() => handleActiveTabs(3)}
          >
            <img src="/images/profile/reviews.svg" alt="Your Reviews" />
            <span>Your Reviews</span>
          </div>
          <div
            className={`tab ${activeTab === 4 ? "active" : ""}`}
            onClick={() => handleActiveTabs(4)}
          >
            <img src="/images/profile/coupen.svg" alt="Coupons & offers" />
            <span>Coupons & offers</span>
          </div>
          <div
            className={`tab ${activeTab === 5 ? "active" : ""}`}
            onClick={() => handleActiveTabs(5)}
          >
            <img src="/images/profile/whistlist.svg" alt="Your Wishlist" />
            <span>Your Wishlist</span>
          </div>
          <div
            className={`tab ${activeTab === 6 ? "active" : ""}`}
            onClick={() => handleActiveTabs(6)}
          >
            <img src="/images/profile/notification.svg" alt="Notifications" />
            <span>Notifications</span>
          </div>
        </div>
        <div className="tab-content">
          {activeTab === 0 && (
            <div className="login_security">
              <h3>Login and Security</h3>
              <div className="login_securityWrapper">
                <form onSubmit={handleSubmit}>
                  <div className="box">
                    <div className="form-control">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      {errors.fullName && (
                        <span className="error">{errors.fullName}</span>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <span className="error">{errors.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label htmlFor="Mobile or Phone Number">
                        Mobile or Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Mobile or Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {errors.phone && (
                        <span className="error">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="explore contact sp-10"
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading && (
                      <img
                        src="/images/loader1.svg"
                        alt="Loader Image"
                        style={{ display: "flex", margin: "auto" }}
                      />
                    )}
                    {!loading && <span>save changes</span>}
                  </button>
                </form>
              </div>
              <h3>Change Password</h3>
              <div className="login_securityWrapper">
                <form onSubmit={handlePasswordUpdateSubmit}>
                <InputField
                    label={OLD_PASSWORD_LABEL}
                    placeholder={OLD_PASSWORD_ENTER}
                    type={PASSWORD_TYPE}
                    name={OLD_PASSWORD}
                    value={changePassword.oldPassword}
                    onChange={handleChange}
                    required
                    validate={validatePasswordLength}
                    errorMessage={PASSWORD}
                  />
                  <div className="input-field">
                    <label htmlFor={PASSWORD_TYPE}>{NEW_PASSWORD_LABEL}</label>
                    <input
                      type={PASSWORD_TYPE}
                      placeholder={NEW_PASSWORD_ENTER}
                      name={NEW_PASSWORD}
                      id={PASSWORD_TYPE}
                      value={password}
                      onChange={handleFormPasswordChange}
                      required
                    />
                    {passwordError && (
                      <p className="error-message">{passwordError}</p>
                    )}
                  </div>
                  <div className="input-field">
                    <label htmlFor={CONFIRM_PASSWORD_LABEL}>{CONFIRM_PASSWORD_LABEL}</label>
                    <input
                      type={PASSWORD_TYPE}
                      placeholder={CONFIRM_PASSWORD_LABEL}
                      name={CONFIRM_PASSWORD}
                      id={CONFIRM_PASSWORD}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="explore contact sp-10"
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading && (
                      <img
                        src="/images/loader1.svg"
                        alt="Loader Image"
                        style={{ display: "flex", margin: "auto" }}
                      />
                    )}
                    {!loading && <span>Submit</span>}
                  </button>
                </form>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="user_order_list">
              
                <>
                  <h3>Track, return, or buy things again</h3>
                  <div className="horizontal-tabs">
                    <div
                      className={activeOrderTab === 0 ? "active" : ""}
                      onClick={() => handleActiveOrderTab(0)}
                    >
                      Active Orders
                    </div>
                    <div
                      className={activeOrderTab === 1 ? "active" : ""}
                      onClick={() => handleActiveOrderTab(1)}
                    >
                      Delivered Orders
                    </div>
                    <div
                      className={activeOrderTab === 2 ? "active" : ""}
                      onClick={() => handleActiveOrderTab(2)}
                    >
                      Return Orders
                    </div>
                    <div
                      className={activeOrderTab === 3 ? "active" : ""}
                      onClick={() => handleActiveOrderTab(3)}
                    >
                      Cancel Orders
                    </div>
                  </div>
                  <div className="order-content">
                    {activeOrderTab === 0 && (
                      <>
                      {activeOrderLoading ? (
                          <div className="loadingContainer">
                              <CircularProgress />
                          </div>
                      ) :(
                        <ActiveOrders />
                      )}
                    </>
                    )}
                    {activeOrderTab === 1 && (
                      <>
                        {deliveredOrderLoading ? (
                          <div className="loadingContainer">
                              <CircularProgress />
                          </div>
                          ) :(
                            <DeliveredOrders />
                        )}
                      </>
                    )}
                    {activeOrderTab === 2 && (
                      <>
                        {returnOrderLoading ? (
                          <div className="loadingContainer">
                              <CircularProgress />
                          </div>
                        ) :(
                          <ReturnOrders />
                        )}
                      </>
                    )}
                    {activeOrderTab === 3 && (
                      <>
                      {cancelledOrderLoading ? (
                        <div className="loadingContainer">
                            <CircularProgress />
                        </div>
                        ) :(
                        <CancelledOrders />
                      )}
                      </>
                      )}
                  </div>
                </>
            </div>
          )}
          {activeTab === 2 && (
            <>
              {addressLoading ? (
                  <div className="loadingContainer">
                      <CircularProgress />
                  </div>
              ) :(
                <Address />
              )}
            </>
          )}
          {activeTab === 3 && (
            <Reviews />
          )}
          {activeTab === 4 && (
            <Coupens />
          )}
          {activeTab === 5 && (
            <Wishlist />
          )}
          {activeTab === 6 && (
            <>
              <Notifications />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
