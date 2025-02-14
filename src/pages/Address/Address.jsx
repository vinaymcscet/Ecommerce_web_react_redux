import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addListAddress, defaultListAddress, deleteListAddress, getListAddress, updateListAddress } from '../../store/slice/api_integration';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { Button } from '@mui/material';
import ReactPaginate from 'react-paginate';
import './Address.css';

const Address = () => {
    const [isInitialAddressLoad, setIsInitialAddressLoad] = useState(true);
    const [page, setPage] = useState(0);  // Default page 0 (first page)
    const [itemsPerPage, setItemsPerPage] = useState(30);
    
    const { totalAddressCount = 0 } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Address Form
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

  const handleAddressInputMobileChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (/^\d+$/.test(value) && !value.startsWith("+44")) {
      updatedValue = `+44${value}`;
      setAddressFormData({ ...addressFormData, [name]: updatedValue });
    } else {
      setAddressFormData({ ...addressFormData, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  }
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
    dispatch(defaultListAddress(responseObj)).finally(() => {
      dispatch(getListAddress(responseObj));
    });
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


    // Pagination code for Address Lists
    useEffect(() => {
        if(isInitialAddressLoad) {
          setIsInitialAddressLoad(false);
          return;
        }
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
  
  return (
    <>
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
                    onChange={handleAddressInputMobileChange}
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
                    <label>Postal code</label>
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
                <button type="submit">{isEditingAddress ? "Update Address" : "Save Address"}</button>
            </form>
            </div>
            <h3>Edit, Remove and set as default addresses for orders </h3>
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
                  <p className='noAddressFound'>No Address found!</p>
              )}
            </div>
            {user[0]?.addresses?.length > 0 && <div className='paginationBox'>
              {/* <div className="itemsPerPageDropdown">
                  <label>Items per page: </label>
                  <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      {itemsPerPageOptions.map(option => (
                          <option key={option} value={option}>
                              {option}
                          </option>
                      ))}
                  </select>
              </div> */}
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
        </div>
    </>
  )
}

export default Address