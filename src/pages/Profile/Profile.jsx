/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { setChangePassword,  setUser } from "../../store/slice/userSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Profile.css";
import StarRating from "../../components/StarRating/StarRating";
import { ToastContainer, toast } from "react-toastify";
import InputField from "../../components/InputBox/InputBox";
import { 
    CONFIRM_PASSWORD, 
    CONFIRM_PASSWORD_LABEL, 
    DEFAULT_OPTIONS, 
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
    addListAddress, 
    addToCartData, 
    changePasswordRequest, 
    defaultListAddress, 
    deleteListAddress, 
    deleteSingleWhistListData, 
    getListAddress, 
    getListOfWhistListData, 
    getOfferList, 
    getUserRequest, 
    getUserReviewProductData, 
    OrderListData, 
    updateListAddress, 
    updateProfileRequest 
} from "../../store/slice/api_integration";
import ReactPaginate from "react-paginate";
import { setListWishList } from "../../store/slice/productSlice";
import { ShareProduct } from "../../utils/ShareProduct";
import Notifications from "../Notifications/Notifications";

const Profile = () => {
  const [copyMessage, setCopyMessage] = useState({ message: "", index: null });
  const [activeTab, setActiveTab] = useState(0);
  const [activeOrderTab, setActiveOrderTab] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(0);  // Default page 0 (first page)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [wishListPage, setWishListPage] = useState(0);  // Default page 0 (first page)
  const [wishListItemsPerPage, setWishListItemsPerPage] = useState(10);
  const [reviewPage, setReviewPage] = useState(0);  // Default page 0 (first page)
  const [reviewPerPage, setReviewPerPage] = useState(10);
  const [invoiceData, setInvoiceData] = useState(null);

  const { user, changePassword } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.modal);
  const { 
    totalAddressCount = 0, 
    offerList, 
    listWishlist, 
    totalWishlistCount = 0, 
    userReviewCount = 0,
    userReview
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.cart);
  console.log("listWishlist", listWishlist);
  
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
    console.log("responseObj", responseObj);
    dispatch(changePasswordRequest(responseObj));
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
    setFormData({ ...formData, [name]: value });
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
      dispatch(updateProfileRequest(responseObj));
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
  //   ======================================================================================================================

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    house_no: "",
    address: "",
    country: "",
    city: "",
    pincode: "",
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({ ...addressFormData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on input change
  };

  const validateAddressFields = () => {
    const newErrors = {};
    if (!addressFormData.address.trim())
      newErrors.address = "Address is required.";
    if (!addressFormData.country.trim())
      newErrors.country = "Country is required.";
    if (!addressFormData.city.trim()) newErrors.city = "City is required.";
    if (!addressFormData.house_no.trim()) newErrors.house_no = "House Number is required.";
    if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(addressFormData.pincode))
      newErrors.pincode = "Invalid UK postal code.";
    return newErrors;
  };

  const validateAllFields = () => {
    const newErrors = {};
    if (!addressFormData.fullName.trim())
      newErrors.fullName = "Full Name is required.";
    if (
      !addressFormData.email.trim() ||
      !/\S+@\S+\.\S+/.test(addressFormData.email)
    )
      newErrors.email = "Invalid email address.";
    if (
      !addressFormData.phone.trim() ||
      !/^\+44\d{10}$/.test(addressFormData.phone)
    )
      newErrors.phone = "Phone number must be in the format +44XXXXXXXXXX (UK format).";
    const addressErrors = validateAddressFields();
    return { ...newErrors, ...addressErrors };
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateAllFields();
    const responseObj = {
      full_name: addressFormData.fullName,
      mobile: addressFormData.phone,
      email: addressFormData.email,
      house_number: addressFormData.house_no,
      street: addressFormData.address,
      locality: addressFormData.city,
      postcode: addressFormData.pincode,
      country: addressFormData.country,
      ...(isEditingAddress && { id: addressFormData.id }) // Add id only if editing
    };
    if (Object.keys(newErrors).length === 0) {
      if(isEditingAddress) {
        dispatch(updateListAddress(responseObj));
      } else {
        dispatch(addListAddress(responseObj));
      }
      // Clear form after successful submission
      setAddressFormData({
        id: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        country: "",
        city: "",
        state: "",
        pincode: "",
        house_no: "",
        isDefault: false,
      });
      setIsEditingAddress(false);
    } else {
      setFormErrors(newErrors);
    }
  };

  const handleDeleteAddress = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(deleteListAddress(responseObj));
    // alert("Address deleted successfully!");
  };

  const handleSetDefaultAddress = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(defaultListAddress(responseObj));
  };

  const handleEditAddress = (address) => {
    window.scrollTo({
      top: 100,
      behavior: 'smooth', // Adds smooth scrolling
    });
    const editAddressObj = {
      id: address.id,
      fullName: address?.full_name?.trim(),
      phone: address?.mobile?.trim(),
      email: address?.email?.trim(),
      house_no: address?.house_number?.trim(),
      address: address?.street?.trim(),
      city: address?.locality?.trim(),
      pincode: address?.postcode?.trim(),
      country: address?.country?.trim(),
      isDefault: false,
    }
    setAddressFormData({ ...editAddressObj }); // Populate form with selected address
    setIsEditingAddress(true); // Set the form to edit mode
  };

  // ======================================================================================================================
  const handleCopy = (title, index) => {
    // Copy the item.title to the clipboard
    navigator.clipboard
      .writeText(title)
      .then(() => {
        // Set success message
        setCopyMessage({ message: "Item copied to clipboard!", index });

        // Hide message after 2 minutes (120,000 milliseconds)
        setTimeout(() => {
          setCopyMessage({ message: "", index: null });
        }, 2000); // 2 minutes
      })
      .catch((err) => {
      });
  };

  //   download PDF
  const downloadPDF = () => {
    const input = document.getElementById("invoice");
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("invoice.pdf");
    });
  };

  const handleRemoveWishListItem = (productId) => {
    const updatedWishlist = listWishlist.filter((item) => item.skuId !== productId);
    dispatch(setListWishList(updatedWishlist)); 

    const responseObj = { sku_id: productId };
    dispatch(deleteSingleWhistListData(responseObj));
  };

  const handleAddToCart = (item) => {
    // Dispatch product details and quantity to Redux
      const responseObj = {
        sku_id: item?.skuId,
        type: 'increase'
      }
      dispatch(addToCartData(responseObj))
  };

  const handleActiveTabs = (value) => {
    const searchParams = new URLSearchParams(location.search);
    // Clear query parameters for cleaner URL
    if (value !== 2 && value !== 5) {
      navigate(location.pathname); // Reset URL without parameters
    }
  
    if (value === 2) {
      navigate(location.pathname);
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      setPage(pageParam - 1); // Set initial page based on URL
  
      const offset = (pageParam - 1) * itemsPerPage; // Adjust offset
      const limit = itemsPerPage;
      console.log("Address Tab Offset:", offset);
  
      const responseObj = {
        offset,
        limit,
      };
      dispatch(getListAddress(responseObj));
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
      console.log("Wishlist Tab Offset:", offset);
  
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
      const responseObj = {
        status: 1,
        offset: 1,
        limit: 10
      }
      dispatch(OrderListData(responseObj));
    }
    setActiveTab(value); // Update active tab
  };
  
  // Pafination code for Address Lists
    useEffect(() => {
      // Extract parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const pageParam = parseInt(searchParams.get("page"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || itemsPerPage;
    
      // Update state with URL parameters
      setPage(pageParam - 1); // Sync pagination (0-based indexing)
      setItemsPerPage(itemsPerPageParam);
    
      // Calculate offset and limit dynamically
      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;
    
      // Dispatch the API call with updated parameters
      const responseObj = {
        offset,
        limit
      }
      dispatch(getListAddress(responseObj));
    }, [location.search, itemsPerPage ,dispatch]);
    
    // Handle dropdown change for itemsPerPage
    const handleItemsPerPageChange = (e) => {
      const newItemsPerPage = parseInt(e.target.value, 10);
      setItemsPerPage(newItemsPerPage);
      setPage(0); // Reset to the first page
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("page", 1);
      searchParams.set("itemsPerPage", newItemsPerPage);
      navigate(`?${searchParams.toString()}`);
    };
    
    // Handle page change for pagination
    const handlePageChange = (data) => {
      const { selected } = data; // `react-paginate` provides 0-based page index
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("page", selected + 1); // Convert to 1-based indexing
      navigate(`?${searchParams.toString()}`); // Update URL
    };

    // Dropdown options for itemsPerPage
    const itemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= totalAddressCount);

    // Pagination Code for WishList Items
    useEffect(() => {
      // Extract parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const pageParam = parseInt(searchParams.get("wishListPage"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("wishListItemsPerPage"), 10) || wishListItemsPerPage;
    
      // Update state with URL parameters
      setWishListPage(pageParam - 1); // Sync pagination (0-based indexing)
      setWishListItemsPerPage(itemsPerPageParam);
    
      // Calculate offset and limit dynamically
      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;
    
      // Dispatch the API call with updated parameters
      const responseObj = {
        offset,
        limit
      }
      console.log("Offset:", offset);
      console.log("Limit:", limit);
      console.log("Wishlist Page:", wishListPage);
      console.log("Items Per Page:", wishListItemsPerPage);
      dispatch(getListOfWhistListData(responseObj));
    }, [location.search, dispatch]);
    
    // Handle dropdown change for itemsPerPage
    const handleWishListItemsPerPageChange = (e) => {
      const newItemsPerPage = parseInt(e.target.value, 10);
      setWishListItemsPerPage(newItemsPerPage);
      setWishListPage(0); // Reset to the first page
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("wishListPage", 1);
      searchParams.set("wishListItemsPerPage", newItemsPerPage);
      navigate(`?${searchParams.toString()}`);
    };
    
    // Handle page change for pagination
    const handleWishListPageChange = (data) => {
      const { selected } = data; // `react-paginate` provides 0-based page index
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("page", selected + 1); // Convert to 1-based indexing
      navigate(`?${searchParams.toString()}`); // Update URL
    };

    // Dropdown options for itemsPerPage
    const wishListItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= totalWishlistCount);


    // Pagination code for User Review List
    useEffect(() => {
      // Extract parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const pageParam = parseInt(searchParams.get("page"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;
    
      // Update state with URL parameters
      setReviewPage(pageParam - 1); // Sync pagination (0-based indexing)
      setReviewPerPage(itemsPerPageParam);
    
      // Calculate offset and limit dynamically
      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;
    
      // Dispatch the API call with updated parameters
      const responseObj = {
        offset,
        limit
      }
      dispatch(getUserReviewProductData(responseObj));
    }, [location.search, reviewPerPage ,dispatch]);
    
    // Handle dropdown change for itemsPerPage
    const handleReviewPerPageChange = (e) => {
      const newItemsPerPage = parseInt(e.target.value, 10);
      setReviewPerPage(newItemsPerPage);
      setReviewPage(0); // Reset to the first page
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("page", 1);
      searchParams.set("itemsPerPage", newItemsPerPage);
      navigate(`?${searchParams.toString()}`);
    };
    
    // Handle page change for pagination
    const handleReviewPageChange = (data) => {
      const { selected } = data; // `react-paginate` provides 0-based page index
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("page", selected + 1); // Convert to 1-based indexing
      navigate(`?${searchParams.toString()}`); // Update URL
    };

    // Dropdown options for itemsPerPage
    const reviewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= userReviewCount);
    const handleActiveOrderTab = (value) => {
      if(value === 0) {
        const responseObj = {
          status: 1,
          offset: 1,
          limit: 10
        }
        dispatch(OrderListData(responseObj));
      }
      if(value === 1) {
        const responseObj = {
          status: 5,
          offset: 1,
          limit: 10
        }
        dispatch(OrderListData(responseObj));
      }
      if(value === 2) {
        const responseObj = {
          status: 4,
          offset: 1,
          limit: 10
        }
        dispatch(OrderListData(responseObj));
      }
      if(value === 3) {
        const responseObj = {
          status: 3,
          offset: 1,
          limit: 10
        }
        dispatch(OrderListData(responseObj));
      }
      setActiveOrderTab(value);
    }
    const handleInvoiceDetails = (product, status) => {
      setShowInvoice(status);
      setInvoiceData(product);
    }
    console.log("invoiceData", invoiceData);

  return (
    <div className="userProfile">
      <h1>Your Profile</h1>
      <div className="vertical-tabs-container">
        <div className="tabs">
          <div className="profile_user_image">
            <img src={(imagePreview ? imagePreview : profile_pic) || '/images/icons/avtar.png'} alt={fullname} />
            <div className="editMode">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <img src={'/images/icons/edit.svg'} alt={'edit icon'} />
            </div>
          </div>
          {errorFileType && <div className="error errorImageType">{errorFileType}</div>}
          <p>Categories</p>
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
              {showInvoice && (
                <div className="userInvoice">
                  <div className="invoiceHeader">
                    <h3>Invoice</h3>
                    <div
                      className="closePDF"
                      onClick={() => setShowInvoice(false)}
                    >
                      <img
                        src="/images/profile/cross1.svg"
                        alt="close PDF VIEW"
                      />
                    </div>
                    <div className="download" onClick={downloadPDF}>
                      Download PDF
                    </div>
                  </div>
                  <div className="tabular_invoice" id="invoice">
                    <table
                      style={{
                        border: "none",
                        width: "100%"
                      }}
                    >
                      <tr>
                        <td style={{ border: "none" }} colSpan={'5'}>
                          <img
                            src="/images/icons/logo.svg"
                            alt="FikFis Logo"
                            width={"200px"}
                            height={"68px"}
                            style={{ border: "none" }}
                          />
                        </td>
                        <td
                           colSpan={'5'}
                          style={{
                            border: "none",
                            fontSize: "15px",
                            fontWeight: "500",
                            textAlign: "right",
                            verticalAlign: "top",
                          }}
                        >
                          Tax Invoice <br />
                          (Original for Recipient)
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={'5'} style={{ border: "none" }}>
                          <table style={{ border: "none" }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                }}
                              >
                                Sold By:
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  border: "none",
                                }}
                              >
                                Vendor Name
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Street Address: 123 Fake Street
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Street Address: 123 Fake Street
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                City: London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Post Town: Greater London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Postal Code: SW1A 1AA
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Country: United Kingdom
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                }}
                              >
                                Phone Number: +44 845625361
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td colSpan={'5'} style={{ border: "none" }}>
                          <table style={{ border: "none", width: "100%", }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Billing Address :
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Street Address: 123 Fake Street
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                City: London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Post Town: Greater London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Postal Code: SW1A 1AA
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Country: United Kingdom
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Phone Number: +44 845625361
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                IN
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                State/UT Code: 09
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={'5'} style={{ border: "none", verticalAlign: "top" }}>
                          <table style={{ border: "none" }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                }}
                              >
                                PAN No:
                                <span
                                  style={{ fontWeight: "400", color: "#000" }}
                                >
                                  
                                  ABDPH1161R
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                }}
                              >
                                TAX Registration No:
                                <span
                                  style={{ fontWeight: "400", color: "#000" }}
                                >
                                  
                                  09ABDPH1161R2ZD
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td colSpan={'5'} style={{ border: "none" }}>
                          <table style={{ border: "none", width: "100%", }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Shipping Address :
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Street Address: 123 Fake Street
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                City: London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Post Town: Greater London
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Postal Code: SW1A 1AA
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Country: United Kingdom
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Phone Number: +44 845625361
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={'5'} style={{ border: "none", verticalAlign: "top" }}>
                          <table style={{ border: "none" }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                }}
                              >
                                Order Number:
                                <span
                                  style={{ fontWeight: "400", color: "#000" }}
                                >
                                  
                                  {invoiceData?.order_number}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                }}
                              >
                                Order Date:
                                <span
                                  style={{ fontWeight: "400", color: "#000" }}
                                >
                                  
                                  06.05.2024
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td colSpan={'5'} style={{ border: "none", width: "100%", }}>
                          <table style={{ border: "none", width: "100%", }}>
                            <tr>
                              <td
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                State/UT Code: 09
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Place of supply: UTTAR PRADESH
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Place of delivery: UTTAR PRADESH
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Invoice Number : LKO1-23349
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Invoice Details : UP-LKO1-143471981-2425
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  border: "none",
                                  textAlign: "right",
                                }}
                              >
                                Invoice Date : 06.05.2024
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <div className="resp_table">
                        <table
                        style={{
                            border: "1px solid #F6F6F6"
                        }}
                        >
                        <tr>
                            <td
                            style={{
                                width: "20px",
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            S. No
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Description
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Unit Price
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Discount
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Qty
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Net Amount
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Tax Rate
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Tax Type
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Tax Amount
                            </td>
                            <td
                            style={{
                                backgroundColor: "#F6F6F6",
                                fontSize: "13px",
                                fontWeight: "600",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "500",
                            }}
                            >
                            Total Amount
                            </td>
                        </tr>
                        <tr>
                            <td
                            style={{
                                verticalAlign: "top",
                                width: "20px",
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            1.
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            {invoiceData.product_name}
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            £2120
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            £0.00
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            2
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            £2120
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            10%
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                            }}
                            >
                            VAT
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                                textAlign: "center",
                            }}
                            >
                            £2320
                            </td>
                            <td
                            style={{
                                borderRight: "1px solid #D1D1D1",
                                fontSize: "13px",
                                fontWeight: "400",
                                textAlign: "center",
                            }}
                            >
                            £2320
                            </td>
                        </tr>
                        <tr>
                            <td
                            style={{
                                fontWeight: "500",
                                borderRight: "1px solid #D1D1D1",
                            }}
                            colSpan={8}
                            >
                            TOTAL:
                            </td>
                            <td
                            style={{
                                fontWeight: "500",
                                borderRight: "1px solid #D1D1D1",
                                backgroundColor: "#F6F6F6",
                                textAlign: "center",
                            }}
                            >
                            £2320
                            </td>
                            <td
                            style={{
                                fontWeight: "500",
                                borderRight: "1px solid #D1D1D1",
                                backgroundColor: "#F6F6F6",
                                textAlign: "center",
                            }}
                            >
                            £2320
                            </td>
                        </tr>
                        <tr>
                            <td
                            colSpan={10}
                            style={{ fontSize: "13px", fontWeight: "500" }}
                            >
                            Amount in Words: <br />
                            One Hundred Forty-nine only
                            </td>
                        </tr>
                        <tr>
                            <td
                            colSpan={10}
                            style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                textAlign: "right",
                            }}
                            >
                            For Mahalaxmi Creations:
                            <br />
                            <br />
                            Authorized Signatory
                            </td>
                        </tr>
                        </table>
                    </div>
                    <table style={{ border: "none" }}>
                      <tr>
                        <td
                          style={{
                            color: "#5E5E5E",
                            fontSize: "10px",
                            textAlign: "left",
                            border: "none",
                          }}
                        >
                          Whether tax is payable under reverse charge - No
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#989898",
                            fontSize: "10px",
                            textAlign: "center",
                            border: "none",
                          }}
                        >
                          *ASSPL-FikFis Seller Services Ltd., JULY-FikFis Retail
                          UK Ltd. (only where FikFis Retail Ltd. fulfillment
                          center is co-located) Customers desirous of availing
                          input VAT credit are requested to create a Business
                          account and purchase on Fikfis.uk.in/business from
                          Business eligible offers Please note that this invoice
                          is not a demand for payment
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              )}
              {!showInvoice && (
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
                      <div className="orderListWrapper">
                        {orderList &&
                          orderList?.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.product_image} alt={item.product_name} />
                                  <div>
                                    <h3>{item.product_name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.return_date}`}</p>
                                    <p>{`Order # ${item.order_number}`}</p>
                                  </div>
                                </div>
                                <div className="rightOrder">
                                  <a
                                    href="#"
                                    onClick={() => handleInvoiceDetails(item, true)}
                                  >
                                    Invoice
                                  </a>
                                  <a href="#">Buy it again</a>
                                  <a href="#">View your item</a>
                                  <a href="#">view order details</a>
                                  <a href="#">write a product review</a>
                                  <a href="#">Get product support</a>
                                </div>
                              </div>
                              <div className="userDetails">
                                <div className="userAddress">
                                  <h6>
                                    SHIP To:
                                    <span>{item.order_shipping_user_name}</span>
                                  </h6>
                                  <p>{item.address}</p>
                                  <p>Phone Number: {item.phone_number}</p>
                                </div>
                                <div className="user_order_details">
                                  <h4>ORDER PlACED</h4>
                                  <p>{item.order_placed}</p>
                                  <h4>Delivered {item.delivery_date}</h4>
                                  <p>{item.delivery_instructions}</p>
                                </div>
                                <div className="user_order_track">
                                  <h4>TRACK ORDER</h4>
                                  <p className="track">{item.tracking_id}</p>
                                  <h4>TOTAL</h4>
                                  <p className="total">
                                    {item.total} include taxes
                                  </p>
                                </div>
                              </div>
                              <div className="tracking_order_status">
                                {item.order_track &&
                                  item.order_track.map((data) => (
                                    <>
                                      <div
                                        key={data.id}
                                        className={`order ${
                                          data.started ? "started" : ""
                                        } ${data.done ? "done" : ""}`}
                                      >
                                        <h6>{data.message}</h6>
                                        <p>{data.track_time}</p>
                                      </div>
                                    </>
                                  ))}
                              </div>
                            </div>
                          ))}
                          {!orderList && <p>No orders found.</p>}
                      </div>
                    )}
                    {activeOrderTab === 1 && (
                      <div className="orderListWrapper">
                        {orderList &&
                          orderList?.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.product_image} alt={item.product_name} />
                                  <div>
                                    <h3>{item.product_name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.return_date}`}</p>
                                    <p>{`Order # ${item.order_number}`}</p>
                                  </div>
                                </div>
                                <div className="rightOrder">
                                  <a
                                    href="#"
                                    onClick={() => setShowInvoice(true)}
                                  >
                                    Invoice
                                  </a>
                                  <a href="#">Buy it again</a>
                                  <a href="#">View your item</a>
                                  <a href="#">view order details</a>
                                  <a href="#">write a product review</a>
                                  <a href="#">Get product support</a>
                                </div>
                              </div>
                              <div className="userDetails">
                                <div className="userAddress">
                                  <h6>
                                    SHIP To:
                                    <span>{item.order_shipping_user_name}</span>
                                  </h6>
                                  <p>{item.address}</p>
                                  <p>Phone Number: {item.phone_number}</p>
                                </div>
                                <div className="user_order_details">
                                  <h4>ORDER PlACED</h4>
                                  <p>{item.order_placed}</p>
                                  <h4>Delivered {item.delivery_date}</h4>
                                  <p>{item.delivery_instructions}</p>
                                </div>
                                <div className="user_order_track">
                                  <h4>ORDER STATUS</h4>
                                  <p className="track">{item.order_status}</p>
                                  <h4>TOTAL</h4>
                                  <p className="total">
                                    {item.total} include taxes
                                  </p>
                                </div>
                              </div>
                              <div className="tracking_order_status">
                                {item.order_track &&
                                  item.order_track.map((data) => (
                                    <>
                                      <div
                                        key={data.id}
                                        className={`order ${
                                          data.started ? "started" : ""
                                        } ${data.done ? "done" : ""}`}
                                      >
                                        <h6>{data.message}</h6>
                                        <p>{data.track_time}</p>
                                      </div>
                                    </>
                                  ))}
                              </div>
                            </div>
                          ))}
                          {!orderList && <p>No orders found.</p>}
                      </div>
                    )}
                    {activeOrderTab === 2 && (
                      <div className="orderListWrapper">
                        {orderList &&
                          orderList?.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.product_image} alt={item.product_name} />
                                  <div>
                                    <h3>{item.product_name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.return_date}`}</p>
                                    <p>{`Order # ${item.order_number}`}</p>
                                  </div>
                                </div>
                                <div className="rightOrder">
                                  <a
                                    href="#"
                                    onClick={() => setShowInvoice(true)}
                                  >
                                    Invoice
                                  </a>
                                  <a href="#">Buy it again</a>
                                  <a href="#">View your item</a>
                                  <a href="#">view order details</a>
                                  <a href="#">write a product review</a>
                                  <a href="#">Get product support</a>
                                </div>
                              </div>
                              <div className="userDetails">
                                <div className="userAddress">
                                  <h6>
                                    SHIP To:
                                    <span>{item.order_shipping_user_name}</span>
                                  </h6>
                                  <p>{item.address}</p>
                                  <p>Phone Number: {item.phone_number}</p>
                                </div>
                                <div className="user_order_details">
                                  <h4>ORDER PICK UP</h4>
                                  <p className="track">{item.order_pickup}</p>
                                  <h4>ORDER PlACED</h4>
                                  <p>{item.order_placed}</p>
                                  <h4>Delivered {item.delivery_date}</h4>
                                  <p>{item.delivery_instructions}</p>
                                </div>
                                <div className="user_order_track">
                                  <h4>ORDER STATUS</h4>
                                  <p className="track">{item.order_status}</p>
                                  <h4>TRACK ORDER</h4>
                                  <p className="track">{item.track_order}</p>
                                  <h4>TOTAL</h4>
                                  <p className="total">
                                    {item.total} include taxes
                                  </p>
                                </div>
                              </div>
                              <div className="tracking_order_status">
                                {item.order_track &&
                                  item.order_track.map((data) => (
                                    <>
                                      <div
                                        key={data.id}
                                        className={`order ${
                                          data.started ? "started" : ""
                                        } ${data.done ? "done" : ""}
                                    ${data.return ? "retrun" : ""}`}
                                      >
                                        <h6>{data.message}</h6>
                                        <p>{data.track_time}</p>
                                      </div>
                                    </>
                                  ))}
                              </div>
                              {item.return && (
                                <div className="tracking_order_status return">
                                  {item.return_order_track &&
                                    item.return_order_track.map((data) => (
                                      <>
                                        <div
                                          key={data.id}
                                          className={`order ${
                                            data.started ? "started" : ""
                                          } ${data.done ? "done" : ""}
                                    ${data.return ? "retrun" : ""}`}
                                        >
                                          <h6>{data.message}</h6>
                                          <p>{data.track_time}</p>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {!orderList && <p>No orders found.</p>}
                      </div>
                    )}
                    {activeOrderTab === 3 && (
                      <div className="orderListWrapper">
                        {orderList &&
                          orderList?.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.product_image} alt={item.product_name} />
                                  <div>
                                    <h3>{item.product_name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.return_date}`}</p>
                                    <p>{`Order # ${item.order_number}`}</p>
                                  </div>
                                </div>
                                <div className="rightOrder">
                                  <a
                                    href="#"
                                    onClick={() => setShowInvoice(true)}
                                  >
                                    Invoice
                                  </a>
                                  <a href="#">Buy it again</a>
                                  <a href="#">View your item</a>
                                  <a href="#">view order details</a>
                                  <a href="#">write a product review</a>
                                  <a href="#">Get product support</a>
                                </div>
                              </div>
                              <div className="userDetails">
                                <div className="userAddress">
                                  <h6>
                                    SHIP To:
                                    <span>{item.order_shipping_user_name}</span>
                                  </h6>
                                  <p>{item.address}</p>
                                  <p>Phone Number: {item.phone_number}</p>
                                </div>
                                <div className="user_order_details">
                                  <h4>ORDER PlACED</h4>
                                  <p>{item.order_placed}</p>
                                  <h4>Delivered {item.delivery_date}</h4>
                                  <p>{item.delivery_instructions}</p>
                                </div>
                                <div className="user_order_track">
                                  <h4>ORDER STATUS</h4>
                                  <p className="track">{item.order_status}</p>
                                  <h4>TOTAL</h4>
                                  <p className="total">
                                    {item.total} include taxes
                                  </p>
                                </div>
                              </div>
                              <div className="tracking_order_status">
                                {item.order_track &&
                                  item.order_track.map((data) => (
                                    <>
                                      <div
                                        key={data.id}
                                        className={`order ${
                                          data.started ? "started" : ""
                                        } ${data.done ? "done" : ""}
                                   ${data.cancel ? "cancel" : ""}`}
                                      >
                                        <h6>{data.message}</h6>
                                        <p>{data.track_time}</p>
                                      </div>
                                    </>
                                  ))}
                              </div>
                            </div>
                          ))}
                          {!orderList && <p>No orders found.</p>}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div className="addressBox">
              <h3>Add addresses for orders </h3>
              <div className="addressForm">
                <form onSubmit={handleAddressSubmit}>
                  <div className="box">
                    <div className="form-control">
                      <label>Full name (First and Last name)</label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressFormData.fullName}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.fullName && (
                        <p className="error">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.phone && (
                        <p className="error">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={addressFormData.email}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.email && (
                        <p className="error">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label>House Number</label>
                      <input
                        type="text"
                        name="house_no"
                        value={addressFormData.house_no}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.house_no && (
                        <p className="error">{formErrors.house_no}</p>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label>Full Address</label>
                      <input
                        type="text"
                        name="address"
                        value={addressFormData.address}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.address && (
                        <p className="error">{formErrors.address}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label>Town/City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressFormData.city}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.city && (
                        <p className="error">{formErrors.city}</p>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label>Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={addressFormData.pincode}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.pincode && (
                        <p className="error">{formErrors.pincode}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label>Country/Region</label>
                      <input
                        type="text"
                        name="country"
                        value={addressFormData.country}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.country && (
                        <p className="error">{formErrors.country}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    value={isEditingAddress ? "Update Address" : "Save Address"}
                    varient="explore contact"
                    space="sp-10"
                  />
                </form>
              </div>
              <h3>Edit, Remove and set as default addresses for orders </h3>
                {user[0]?.addresses?.length > 0 && <div className='paginationBox'>
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Pagination component */}
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.max(Math.ceil(totalAddressCount / itemsPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(ev) => handlePageChange(ev)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={page}  // Sync current page with URL
                        disabled={totalAddressCount === 0} 
                    />
                  </div>
                }
              <div className="addressList">
                {user[0].addresses ? (
                  <ul>
                    {user[0].addresses.map((address) => (
                      <li key={address.id}>
                        <h4>{address.full_name}</h4>
                        <p className="address">
                          Full Address: {address.house_number}, {address.street}, {address.country},
                          {address.postcode}
                        </p>
                        <p>Email: {address.email}</p>
                        <p>Phone Number: {address.mobile}</p>
                        <div className="action">
                          <p onClick={() => handleEditAddress(address)}>
                            Edit |
                          </p>
                          <p onClick={() => handleDeleteAddress(address.id)}>
                            Remove |
                          </p>
                          <p
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className={address.isDefault === "True" ? "default" : ""}
                          >
                            {address.isDefault === "True" ? "Default" : "Set as Default"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Address found!</p>
                )}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="reviewedItems">
              <h3>Item Reviews</h3>
              {userReview && <div className='paginationBox'>
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={reviewPerPage} onChange={handleReviewPerPageChange}>
                            {reviewItemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Pagination component */}
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.max(Math.ceil(userReviewCount / reviewPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(ev) => handleReviewPageChange(ev)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={reviewPage}  // Sync current page with URL
                        disabled={userReviewCount === 0} 
                    />
                  </div>
                }
              <div className="reviewItemList">
                {userReview &&
                  userReview.map((item, index) => (
                    <div className="reviewProduct" key={index}>
                      <div className="item_header">
                        <div className="leftReviewPart">
                          <img src={item.imageUrl} alt={item.product_name} />
                        </div>
                        <div className="rightReviewPart">
                          {item.product_name && <h4>{item.product_name}</h4>}
                          {item.product_id && <p>ORDER # {item.product_id}</p>}
                          {item.rating && (
                            <StarRating userrating={item.rating} />
                          )}
                        </div>
                      </div>
                      {/* <p>{item.descriptipn}</p> */}
                      <div className="reviewd_prd_image">
                        {item.review_images &&
                          item.review_images.map((img_data, index) => (
                            <div className="item" key={index}>
                              <img src={img_data} alt={item.product_name} />
                            </div>
                          ))}
                      </div>
                      {/* <div className="review_time">{item.date}</div> */}
                    </div>
                  ))}
                {!userReview && <p className="noReviews">No reviews found.</p>}
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div className="coupens">
              <h3>Hurry Up!!! </h3>
              <div className="coupensList">
                {offerList && offerList.map((item, index) => (
                    <div className="availableCoupen" key={index}>
                      {copyMessage.index === index && (
                        <p className="selectedCopiedMessage">
                          {copyMessage.message}
                        </p>
                      )}
                      <div
                        className="copySelection"
                        onClick={() => handleCopy(item.coupon_code, index)}
                      >
                        <img src="/images/icons/copy.svg" alt="copy Item" />
                      </div>
                      <h4>{item.coupon_title}</h4>
                      <p>{item.description}</p>
                      {item.term_of_use &&  (<ul>
                          <li dangerouslySetInnerHTML={{__html: item.term_of_use}} />
                        </ul>)
                      }                      
                      <p className="validity">Validity: {item.valid_from} to {item.valid_till}</p>
                    </div>
                  ))}
                {!offerList && <p>No Coupens available now</p>}
              </div>
            </div>
          )}
          {activeTab === 5 && (
            <div className="whistlistList">
              <h3>Your Wishlist Waiting...</h3>
              {listWishlist && <div className='paginationBox'>
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={wishListItemsPerPage} onChange={handleWishListItemsPerPageChange}>
                            {wishListItemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Pagination component */}
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.max(Math.ceil(totalWishlistCount / wishListItemsPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(ev) => handleWishListPageChange(ev)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={wishListPage}  // Sync current page with URL
                        disabled={totalWishlistCount === 0} 
                    />
                  </div>
                }
              <div className="whistListWrapper">
                {listWishlist &&
                  listWishlist.map((item, index) => (
                    <div key={index} className="whistlistMainWrapper">
                      <div className="whistlistBox">
                        <div className="leftWhistlist">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <div className="rightWhistlist">
                          <h4>
                            <span>{item.name}</span>
                            <button className="addToCart" onClick={() => handleAddToCart(item)}>Add to cart</button>
                          </h4>
                          {item.rating && (
                            <StarRating userrating={item.rating} />
                          )}
                          <div className="priceSection">
                            <div className="priceList">
                              <p className="discount">£ {item.discountedPrice}</p>
                              <p className="original">£ {item.price}</p>
                            </div>
                            {item.offer && (
                              <p className="discount">£ {item.offer}</p>
                            )}
                          </div>
                          <div className="cartActionItems">
                            <div className="icon">
                              <img
                                src="/images/icons/share.svg"
                                alt="share Item"
                                onClick={() => ShareProduct(item?.productId)}
                              />
                            </div>
                            <div
                              className="icon"
                              onClick={() => handleRemoveWishListItem(item.skuId)}
                            >
                              <img
                                src="/images/icons/delete.svg"
                                alt="delete Item"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {listWishlist === null && <p className="noWishlist">your wishlist is empty.</p>}
              </div>
            </div>
          )}
          {activeTab === 6 && (
            <>
              <Notifications />
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
