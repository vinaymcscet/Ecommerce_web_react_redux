import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  editAddress,
  removeAddress,
  saveAddress,
  setDefaultAddress,
  toggleAddressModal,
} from "../../store/slice/modalSlice";
import "./AddressModal.css";
import Button from "../Button/Button";
import { addListAddress, defaultListAddress, deleteListAddress, getListAddress, updateListAddress } from "../../store/slice/api_integration";

const AddressModal = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = [useRef(null), useRef(null)];
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    mobile: "",
    house_no: "",
    address: "",
    country: "",
    city: "",
    pincode: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const { addresses, defaultAddressId, selectedAddress, isAddressModelOpen } = useSelector(
    (state) => state.modal
  );
  const { user } = useSelector((state) => state.user);
  
  const closeModal = () => {
    dispatch(toggleAddressModal(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  
  const validateAddressFields = () => {
    const newErrors = {};
    if (!formData.address.trim())
      newErrors.address = "Address is required.";
    if (!formData.country.trim())
      newErrors.country = "Country is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.house_no.trim()) newErrors.house_no = "House Number is required.";
    if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(formData.pincode))
      newErrors.pincode = "Invalid UK postal code.";
    return newErrors;
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (
      !formData.email.trim() ||
      !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (
      !formData.mobile.trim() ||
      !/^\+44\d{10}$/.test(formData.mobile)
    ) newErrors.mobile = "Phone number must be in the format +44XXXXXXXXXX (UK format).";
    const addressErrors = validateAddressFields();
    return { ...newErrors, ...addressErrors };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    const responseObj = {
      full_name: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      house_number: formData.house_no,
      street: formData.address,
      locality: formData.city,
      postcode: formData.pincode,
      country: formData.country,
      ...(isEditMode && { id: formData.id }) // Add id only if editing
    };
    const responsePayload = {
      offset: 0,
      limit: 20
    }
    if (Object.keys(validationErrors).length === 0) {
      if(isEditMode) {
        dispatch(updateListAddress(responseObj));
        dispatch(getListAddress(responsePayload));
      } else {
        dispatch(addListAddress(responseObj));
        dispatch(getListAddress(responsePayload));
      }
      // Clear form after successful submission
      setFormData({
        id: "",
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        country: "",
        city: "",
        pincode: "",
        house_no: "",
        isDefault: false,
      });
      setIsEditMode(false);
      setActiveTab(1); // Switch to the "Save Address" tab
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEdit = (address) => {
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
    setFormData({ ...editAddressObj }); // Populate form with selected address
    setIsEditMode(true); 
    setActiveTab(0);
  };

  const handleRemove = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(deleteListAddress(responseObj));
    // dispatch(removeAddress(id));
  };

  const handleSetDefault = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(defaultListAddress(responseObj));
  };

  useEffect(() => {
    const responseObj = {
      offset: 0,
      limit: 20
    }
    dispatch(getListAddress(responseObj));
    if (selectedAddress && isAddressModelOpen) {
      setFormData({
        id: selectedAddress.id,
        fullName: selectedAddress.full_name,
        email: selectedAddress.email,
        address: selectedAddress.street,
        country: selectedAddress.country,
        city: selectedAddress.locality,
        pincode: selectedAddress.postcode,
        mobile: selectedAddress.mobile,
        house_no: selectedAddress.house_number,
        isDefault: false,
      });
      setIsEditMode(true);
      setEditAddressId(selectedAddress.id);
    }
  }, [selectedAddress, isAddressModelOpen]);

  return (
    <div className="categoryModal address">
      <div className="modalBackdrop">
        <div className="modalContent">
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
          <div className="addressTabsContainer">
            <div className="tabs-container">
              <div className="tabs-buttons">
                <button
                  className={activeTab === 0 ? "active" : ""}
                  onClick={() => setActiveTab(0)}
                >
                  {isEditMode ? "Edit Address" : "Add Address"}
                </button>
                <button
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => setActiveTab(1)}
                >
                  Save Address
                </button>
              </div>
              <div className="tabs-content">
                <div
                  className="tab-content"
                  ref={tabRefs[0]}
                  style={{ display: activeTab === 0 ? "block" : "none" }}
                >
                  <div className="addressForm">
                    <form onSubmit={handleSubmit}>
                      <div className="box">
                        <div className="form-control">
                          <label>Full Name(First and Last name)</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                          {errors.fullName && (
                            <p className="error">{errors.fullName}</p>
                          )}
                        </div>
                        <div className="form-control">
                          <label>Mobile Number</label>
                          <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                          />
                          {errors.mobile && (
                            <p className="error">{errors.mobile}</p>
                          )}
                        </div>
                      </div>
                      <div className="box">
                        <div className="form-control">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <p className="error">{errors.email}</p>
                          )}
                        </div>
                        <div className="form-control">
                          <label>House Number</label>
                          <input
                            type="text"
                            name="house_no"
                            value={formData.house_no}
                            onChange={handleInputChange}
                          />
                          {errors.house_no && (
                            <p className="error">{errors.house_no}</p>
                          )}
                        </div>
                      </div>
                      <div className="box">
                        <div className="form-control">
                          <label>Full Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                          {errors.address && (
                            <p className="error">{errors.address}</p>
                          )}
                        </div>
                        <div className="form-control">
                          <label>Town/City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                          {errors.city && (
                            <p className="error">{errors.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="box">
                      <div className="form-control">
                          <label>Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                          />
                          {errors.pincode && (
                            <p className="error">{errors.pincode}</p>
                          )}
                        </div>
                        <div className="form-control">
                          <label>Country/Region</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                          />
                          {errors.country && (
                            <p className="error">{errors.country}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        value={isEditMode ? "Update Address" : "Save Address"}
                        varient="explore"
                        space="sp-10"
                      />
                    </form>
                  </div>
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[1]}
                  style={{ display: activeTab === 1 ? "block" : "none" }}
                >
                  <div className="addressList">
                    {user[0].addresses.length > 0 ? (
                      <ul>
                        {user[0].addresses.map((address) => (
                          <li key={address.id}>
                            <h4>{address.fullName}</h4>
                            <p>
                              Full Address: {address.house_number}, {address.street},
                              {address.locality}, {address.postcode}
                            </p>
                            <p>Phone Number: {address.mobile}</p>
                            <p>Email: {address.email}</p>
                            <div className="action">
                              <p onClick={() => handleEdit(address)}>Edit |</p>
                              <p onClick={() => handleRemove(address.id)}>
                                Remove |
                              </p>
                              <p onClick={() => handleSetDefault(address.id)}>
                                {address.isDefault.toLowerCase() === 'true'
                                  ? "Default"
                                  : "Set as Default"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No saved addresses</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
