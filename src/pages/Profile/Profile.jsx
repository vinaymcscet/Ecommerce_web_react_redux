/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import {
  removeAddress,
  setDefaultAddress,
  setUser,
} from "../../store/slice/userSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Profile.css";
import StarRating from "../../components/StarRating/StarRating";
import { ToastContainer, toast } from "react-toastify";
import { addToCart } from "../../store/slice/cartSlice";

const Profile = () => {
  const [copyMessage, setCopyMessage] = useState({ message: "", index: null });
  const [activeTab, setActiveTab] = useState(0);
  const [activeOrderTab, setActiveOrderTab] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { image, email, name, phone, password } = user?.[0] || {};

  useEffect(() => {
    if (user && user[0]) {
      console.log(user[0]);
      console.log(image, email, name);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: name || "",
    email: email || "",
    phone: phone || "",
    password: password || "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
  });

  useEffect(() => {
    if (user && user[0]) {
      setFormData({
        fullName: name || "",
        email: email || "",
        phone: phone || "",
        password: password || "",
      });
    }
  }, [user, name, email, phone, password]);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = (field) => {
    const updatedErrors = validateField(field);
    if (Object.keys(updatedErrors).length === 0) {
      setIsEditing({ ...isEditing, [field]: false });
    } else {
      setErrors({ ...errors, ...updatedErrors });
    }
  };

  const handleCancelClick = (field) => {
    setFormData({
      fullName: name,
      email: email,
      phone: phone,
      password: password,
    });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const validateField = (field) => {
    const newErrors = {};
    if (field === "email" && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (field === "phone" && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (field === "password" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (field === "fullName" && formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
    }
    return newErrors;
  };
  //   console.log(formData);
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
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be a valid 10-digit number.";
    }

    // Ensure password is at least 6 characters long
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    return newErrors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      // Dispatch the action to update the Redux user state
      dispatch(setUser(formData));
      alert("Profile updated successfully!");
    } else {
      setErrors(newErrors);
    }
  };

  //   ======================================================================================================================

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    state: "",
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
    if (!addressFormData.state.trim()) newErrors.state = "State is required.";
    if (!/^\d{6}$/.test(addressFormData.pincode))
      newErrors.pincode = "Pincode must be a valid 6-digit number.";
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
      !/^\d{10}$/.test(addressFormData.phone)
    )
      newErrors.phone = "Phone number must be a valid 10-digit number.";
    const addressErrors = validateAddressFields();
    return { ...newErrors, ...addressErrors };
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted!"); // Check if this logs
    const newErrors = validateAllFields();
    if (Object.keys(newErrors).length === 0) {
      // If no validation errors, update the addresses
      const updatedAddresses = [...(user[0]?.addresses || [])]; // Clone current addresses array

      const existingIndex = updatedAddresses.findIndex(
        (addr) => addr.id === addressFormData.id
      );

      if (existingIndex !== -1) {
        // If address already exists, update it
        updatedAddresses[existingIndex] = addressFormData;
      } else {
        // If new address, add to array
        updatedAddresses.push({ ...addressFormData, id: Date.now() });
      }

      // Dispatch the updated user data with updated addresses
      dispatch(setUser({ ...user[0], addresses: updatedAddresses }));

      // Clear form after successful submission
      setAddressFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        country: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });

      alert("Profile updated successfully!");
      setIsEditingAddress(false);
    } else {
      setFormErrors(newErrors);
    }
  };

  const handleDeleteAddress = (addressId) => {
    dispatch(removeAddress(addressId));
    alert("Address deleted successfully!");
  };

  const handleSetDefaultAddress = (addressId) => {
    dispatch(setDefaultAddress(addressId));
  };

  const handleEditAddress = (address) => {
    setAddressFormData({ ...address }); // Populate form with selected address
    setIsEditingAddress(true); // Set the form to edit mode
  };

  //   ======================================================================================================================
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
        console.error("Failed to copy: ", err);
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

  const handleRemoveItem = (productId) => {
    // Filter out the item with the matching productId from the wishlist
    const updatedWishlist = user[0].wishlist.filter(
      (item) => item.id !== productId
    );
  
    // Dispatch the updated user object with the modified wishlist
    dispatch(setUser({
      ...user[0],                // Spread the existing user object
      wishlist: updatedWishlist, // Update the wishlist array
    }));
  
    toast.success("Item removed from Wishlist");
  };

  const handleAddToCart = (item) => {
    // Dispatch product details and quantity to Redux
    const productData = {
        ...item,
        quantity,
        // selectedSize: product.sizeList[activeIndex]?.name,
      };
    dispatch(addToCart(productData));
    toast.success("Item added to Cart successfully");
  };

  return (
    <div className="userProfile">
      <h1>Your Profile</h1>
      <div className="vertical-tabs-container">
        <div className="tabs">
          <div className="profile_user_image">
            <img src={image} alt={name} />
          </div>
          <p>Categories</p>
          <div className="email">{email}</div>
          <div
            className={`tab ${activeTab === 0 ? "active" : ""}`}
            onClick={() => setActiveTab(0)}
          >
            <img src="/images/profile/user1.svg" alt="Login" />
            <span>Login and Security</span>
          </div>
          <div
            className={`tab ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
          >
            <img src="/images/profile/orders.svg" alt="Login" />
            <span>Your Orders</span>
          </div>
          <div
            className={`tab ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            <img src="/images/profile/address.svg" alt="Login" />
            <span>Your Address</span>
          </div>
          <div
            className={`tab ${activeTab === 3 ? "active" : ""}`}
            onClick={() => setActiveTab(3)}
          >
            <img src="/images/profile/reviews.svg" alt="Login" />
            <span>Your Reviews</span>
          </div>
          <div
            className={`tab ${activeTab === 4 ? "active" : ""}`}
            onClick={() => setActiveTab(4)}
          >
            <img src="/images/profile/coupen.svg" alt="Login" />
            <span>Coupons & offers</span>
          </div>
          <div
            className={`tab ${activeTab === 5 ? "active" : ""}`}
            onClick={() => setActiveTab(5)}
          >
            <img src="/images/profile/whistlist.svg" alt="Login" />
            <span>Your Wishlist</span>
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
                      <label for="fullName">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing.fullName}
                      />
                      {errors.fullName && (
                        <span className="error">{errors.fullName}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.fullName ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("fullName")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("fullName")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("fullName")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing.email}
                      />
                      {errors.email && (
                        <span className="error">{errors.email}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.email ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("email")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("email")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("email")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="Mobile or Phone Number">
                        Mobile or Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Mobile or Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing.phone}
                      />
                      {errors.phone && (
                        <span className="error">{errors.phone}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.phone ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("phone")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("phone")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("phone")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="password">Password</label>
                      <input
                        type={!isEditing.password ? "password" : "text"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={!isEditing.password}
                      />
                      {errors.password && (
                        <span className="error">{errors.password}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.password ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("password")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("password")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("password")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type={"submit"}
                    value={"save changes"}
                    varient="explore contact"
                    space="sp-10"
                  />
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
                      {" "}
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
                      }}
                    >
                      <tr>
                        <td style={{ border: "none" }}>
                          <img
                            src="/images/icons/logo.svg"
                            alt="FikFis Logo"
                            width={"200px"}
                            height={"68px"}
                            style={{ border: "none" }}
                          />
                        </td>
                        <td
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
                        <td style={{ border: "none" }}>
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
                        <td style={{ border: "none" }}>
                          <table style={{ border: "none" }}>
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
                      {/* <tr>
                            <td style={{border: "none" }}>&nbsp;</td>
                            <td style={{border: "none" }}>&nbsp;</td>
                        </tr> */}
                      <tr>
                        <td style={{ border: "none", verticalAlign: "top" }}>
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
                                  {" "}
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
                                  {" "}
                                  09ABDPH1161R2ZD
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style={{ border: "none" }}>
                          <table style={{ border: "none" }}>
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
                      {/* <tr>
                            <td style={{ border: "none" }}>&nbsp;</td>
                            <td style={{ border: "none" }}>&nbsp;</td>
                        </tr> */}
                      <tr>
                        <td style={{ border: "none", verticalAlign: "top" }}>
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
                                  {" "}
                                  402-0942907-2957941
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
                                  {" "}
                                  06.05.2024
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style={{ border: "none" }}>
                          <table style={{ border: "none" }}>
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
                            border: "1px solid #F6F6F6",
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
                            Sl. No
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
                            TheGiftKart Crystal Clear Mi Redmi 13C 5G / Poco M6 5G
                            Back Cover Case | 360 Degree Protection | Shock Proof
                            Design | Transparent Back Cover Case for Redmi 13C 5G
                            / Poco M6 (PC & TPU, Black Bumper) | B0CPPCCRM9 (
                            MA-Black_BumperClearCase-Rdmi_13C_5G ) HSN:392690
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
                      onClick={() => setActiveOrderTab(0)}
                    >
                      Active Orders
                    </div>
                    <div
                      className={activeOrderTab === 1 ? "active" : ""}
                      onClick={() => setActiveOrderTab(1)}
                    >
                      Delivered Orders
                    </div>
                    <div
                      className={activeOrderTab === 2 ? "active" : ""}
                      onClick={() => setActiveOrderTab(2)}
                    >
                      Return Orders
                    </div>
                    <div
                      className={activeOrderTab === 3 ? "active" : ""}
                      onClick={() => setActiveOrderTab(3)}
                    >
                      Cancel Orders
                    </div>
                  </div>
                  <div className="order-content">
                    {activeOrderTab === 0 && (
                      <div className="orderListWrapper">
                        {user[0] &&
                          user[0].activeOrders.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.image} alt={item.name} />
                                  <div>
                                    <h3>{item.name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.openReturnWindow}`}</p>
                                    <p>{`Order # ${item.order_id}`}</p>
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
                      </div>
                    )}
                    {activeOrderTab === 1 && (
                      <div className="orderListWrapper">
                        {user[0] &&
                          user[0].deliveredOrders.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.image} alt={item.name} />
                                  <div>
                                    <h3>{item.name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.openReturnWindow}`}</p>
                                    <p>{`Order # ${item.order_id}`}</p>
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
                      </div>
                    )}
                    {activeOrderTab === 2 && (
                      <div className="orderListWrapper">
                        {user[0] &&
                          user[0].returnOrders.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.image} alt={item.name} />
                                  <div>
                                    <h3>{item.name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.openReturnWindow}`}</p>
                                    <p>{`Order # ${item.order_id}`}</p>
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
                      </div>
                    )}
                    {activeOrderTab === 3 && (
                      <div className="orderListWrapper">
                        {user[0] &&
                          user[0].cancelledOrders.map((item, index) => (
                            <div className="orderList active" key={index}>
                              <div className="orderDetail">
                                <div className="leftOrder">
                                  <img src={item.image} alt={item.name} />
                                  <div>
                                    <h3>{item.name}</h3>
                                    <p className="openReturnWindow">{`Return window open on ${item.openReturnWindow}`}</p>
                                    <p>{`Order # ${item.order_id}`}</p>
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
                  </div>
                  <div className="box">
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
                  </div>
                  <div className="box">
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
                    <div className="form-control">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={addressFormData.state}
                        onChange={handleAddressInputChange}
                      />
                      {formErrors.state && (
                        <p className="error">{formErrors.state}</p>
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
              <div className="addressList">
                {user[0].addresses ? (
                  <ul>
                    {user[0].addresses.map((address) => (
                      <li key={address.id}>
                        <h4>{address.fullName}</h4>
                        <p className="address">
                          Full Address: {address.address}, {address.city},
                          {address.state}, {address.pincode}
                        </p>
                        <p>Phone Number: {address.phone}</p>
                        <div className="action">
                          <p onClick={() => handleEditAddress(address)}>
                            Edit |
                          </p>
                          <p onClick={() => handleDeleteAddress(address.id)}>
                            Remove |
                          </p>
                          <p
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className={address.isDefault ? "default" : ""}
                          >
                            {address.isDefault ? "Default" : "Set as Default"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="reviewedItems">
              <h3>Item Reviews</h3>
              <div className="reviewItemList">
                {user[0].reviewedProducts &&
                  user[0].reviewedProducts.map((item, index) => (
                    <div className="reviewProduct">
                      <div className="item_header">
                        <div className="leftReviewPart">
                          <img src={item.prd_image} alt={item.prd_name} />
                        </div>
                        <div className="rightReviewPart">
                          {item.prd_name && <h4>{item.prd_name}</h4>}
                          {item.order_no && <p>ORDER # {item.order_no}</p>}
                          {item.rating && (
                            <StarRating userrating={item.rating} />
                          )}
                        </div>
                      </div>
                      <p>{item.descriptipn}</p>
                      <div className="reviewd_prd_image">
                        {item.prd_review_image &&
                          item.prd_review_image.map((img_data) => (
                            <div className="item">
                              <img src={item.prd_image} alt={item.prd_name} />
                            </div>
                          ))}
                      </div>
                      <div className="review_time">{item.date}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div className="coupens">
              <h3>Hurry Up!!! </h3>
              <div className="coupensList">
                {user[0].availableCoupens &&
                  user[0].availableCoupens.map((item, index) => (
                    <div className="availableCoupen" key={index}>
                      {copyMessage.index === index && (
                        <p className="selectedCopiedMessage">
                          {copyMessage.message}
                        </p>
                      )}
                      <div
                        className="copySelection"
                        onClick={() => handleCopy(item.title, index)}
                      >
                        <img src="/images/icons/copy.svg" alt="copy Item" />
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.terms}</p>
                      <ul>
                        {item.conditions &&
                          item.conditions.map((data) => <li>{data.value}</li>)}
                      </ul>
                      <p className="validity">{item.validity}</p>
                    </div>
                  ))}
                {!user[0].availableCoupens && <p>No Coupens available now</p>}
              </div>
            </div>
          )}
          {activeTab === 5 && (
            <div className="whistlistList">
              <h3>Your Wishlist Waiting...</h3>
              <div className="whistListWrapper">
                {user[0].wishlist &&
                  user[0].wishlist.map((item, index) => (
                    <div key={index} className="whistlistMainWrapper">
                      <div className="whistlistBox">
                        <div className="leftWhistlist">
                          <img src={item.image} alt={item.name} />
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
                              <p className="discount">$ {item.discount}</p>
                              <p className="original">$ {item.original}</p>
                            </div>
                            {item.discountLabel && (
                              <p className="discount">$ {item.discountLabel}</p>
                            )}
                          </div>
                          <div className="cartActionItems">
                            <div className="icon">
                              <img
                                src="/images/icons/share.svg"
                                alt="share Item"
                              />
                            </div>
                            <div
                              className="icon"
                              onClick={() => handleRemoveItem(item.id)}
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
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
