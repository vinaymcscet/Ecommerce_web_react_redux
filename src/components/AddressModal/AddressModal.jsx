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

const AddressModal = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = [useRef(null), useRef(null)];
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    country: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

  const { addresses, defaultAddressId, selectedAddress, isAddressModelOpen } = useSelector(
    (state) => state.modal
  );

  const closeModal = () => {
    dispatch(toggleAddressModal(false));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile Number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (isEditMode) {
        dispatch(editAddress({ id: editAddressId, updatedData: formData }));
      } else {
        dispatch(saveAddress(formData));
      }
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        country: "",
        city: "",
        state: "",
        pincode: "",
      });
      setIsEditMode(false);
      setActiveTab(1); // Switch to the "Save Address" tab
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditAddressId(address.id);
    setIsEditMode(true);
    setActiveTab(0);
  };

  const handleRemove = (id) => {
    dispatch(removeAddress(id));
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };

  useEffect(() => {
    if (selectedAddress && isAddressModelOpen) {
      setFormData({
        fullName: selectedAddress.fullName,
        email: selectedAddress.email,
        address: selectedAddress.address,
        country: selectedAddress.country,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        mobile: selectedAddress.mobile,
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
                      <div className="box full">
                        <div className="form-control">
                          <label>Full Name</label>
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
                      </div>
                      <div className="box full">
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
                      </div>
                      <div className="box full">
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
                      <div className="box full">
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
                      </div>
                      <div className="box">
                        <div className="form-control">
                          <label>Country</label>
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
                        <div className="form-control">
                          <label>City</label>
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
                          <label>State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                          />
                          {errors.state && (
                            <p className="error">{errors.state}</p>
                          )}
                        </div>
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
                    {addresses.length > 0 ? (
                      <ul>
                        {addresses.map((address) => (
                          <li key={address.id}>
                            <h4>{address.fullName}</h4>
                            <p>
                              Full Address: {address.address}, {address.city},
                              {address.state}, {address.pincode}
                            </p>
                            <p>Phone Number: {address.mobile}</p>
                            <div className="action">
                              <p onClick={() => handleEdit(address)}>Edit |</p>
                              <p onClick={() => handleRemove(address.id)}>
                                Remove |
                              </p>
                              <p onClick={() => handleSetDefault(address.id)}>
                                {defaultAddressId === address.id
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
