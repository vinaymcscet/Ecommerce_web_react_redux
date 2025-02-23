import React, { startTransition, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import StarRating from "../../components/StarRating/StarRating";
import { setViewCartItems, setAllOffetList, setCheckOutFormModal } from "../../store/slice/cartSlice";
import {
  toggleAddressModal,
  editAddress,
} from "../../store/slice/modalSlice";
import { paymentOptions } from "../../utils/CommonUtils";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { 
  addToCartData, 
  createOrderData, 
  defaultListAddress, 
  deleteItemsInCartData, 
  deleteListAddress, 
  getListAddress, 
  getUserRequest, 
  viewItemsInCartData
 } from "../../store/slice/api_integration";
import "./Cart.css";
import { ShareProduct } from "../../utils/ShareProduct";

import { getDeviceType } from "../../utils/CheckDevice";
import { CircularProgress } from "@mui/material";
import { setDefaultUserAddress } from "../../store/slice/userSlice";

const Cart = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [errorMessage, setErrorMessage] = useState("");
  const [coupenCode, setCoupenCode] = useState("");
  // const [clientSecret, setClientSecret] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDefaultSet, setIsDefaultSet] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  // const [clientSecret, setClientSecret] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [filteredCoupenId, setFilteredCoupenId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, viewCartItems } = useSelector((state) => state.cart);
  const { offerList } = useSelector((state) => state.product);
  
  // const { addresses, defaultAddressId } = useSelector((state) => state.modal);
  const { user, defaultUserAddress } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(viewItemsInCartData());
  }, [])

  const handleQuantityChange = (id, type) => {
    // dispatch(updateQuantity({ id, quantity }));
    const responseObj = {
      sku_id: id,
      type,
    }
    dispatch(addToCartData(responseObj))
  };

  const handleApplyPromoCode = () => {
    const responseObj = { coupon_code: coupenCode }
    let filteredCoupen = offerList.filter(offer => offer?.coupon_code === coupenCode);
    setFilteredCoupenId(filteredCoupen[0]?.id);
    dispatch(viewItemsInCartData(responseObj))
    // dispatch(viewItemsInCartWithCoupen(responseObj))
  }
  
  // Function to remove an item
  const handleRemoveItem = (id) => {
    const responseObj = { cart_id: id }
    dispatch(deleteItemsInCartData(responseObj)).finally(() => {
      dispatch(viewItemsInCartData());
      if(viewCartItems?.cartItems.length === 1) dispatch(setViewCartItems(null));
    })
    // dispatch(removeItem(id));
  };

  const handleAddress = () => {
    startTransition(() => {
      dispatch(toggleAddressModal({ isOpen: true }));
    });
  };

  const handleAddressModal = (address = null) => {
    startTransition(() => {
      dispatch(toggleAddressModal({ isOpen: true, address }));
      if (address) {
        dispatch(editAddress({ id: address.id, updatedData: address }))
        dispatch(viewItemsInCartData()); 
      }
    });
  };

  const handleRemoveAddress = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(deleteListAddress(responseObj)).finally(() => {
      const responseObj = {
        offset: 0,
        limit: 20
      }
      dispatch(getListAddress(responseObj));
    });
  };

  const handleSetDefaultAddress = (addressId) => {
    const responseObj = { id: addressId }
    dispatch(defaultListAddress(responseObj));
  };

  const handleNextTab = () => {
    setErrorMessage("");
    if(activeTab === 0 && viewCartItems?.cartItems != null) {
      const responseObj = {
        offset: 0,
        limit: 20
      }
      dispatch(getListAddress(responseObj));
    }
    if (activeTab === 0 && (viewCartItems?.cartItems === null || viewCartItems?.cartItems === undefined)) {
      setErrorMessage(
        "Your cart is empty. Please add items before proceeding to Shipping."
      );
      return;
    }
    if (activeTab === 1 && selectedAddress === null) {
      setErrorMessage(
        "Please add a shipping address before proceeding to Payment."
      );
      return;
    }
    if(activeTab === 1) {
        const responseObj = {
          offset: 0,
          limit: 20
        }
        dispatch(getListAddress(responseObj));
        dispatch(viewItemsInCartData());
    }
    if (activeTab === 2) { // Replace with your Publishable Key
      setCheckoutLoading(true);
      const responseObj = {
        address_id : viewCartItems?.address?.id,
        // cart_amount : viewCartItems?.cartPrice?.totalAmount,
        // subtotal_amount : viewCartItems?.cartPrice?.totalAmount,
        // coupon_code: coupenCode,
        // discount: viewCartItems?.cartPrice?.discount,
        // total_delivery_charge: viewCartItems?.cartPrice?.deliveryCharge,
        // tax: viewCartItems?.cartPrice?.tax,
        device_type : getDeviceType(),
        offer_id: filteredCoupenId
      }
      dispatch(createOrderData(responseObj)).finally(() => {
        // setActiveTab(activeTab + 1);
        const payload = {isOpen: isOpen};
        dispatch(setCheckOutFormModal(payload))
        setCheckoutLoading(false);
      })
    }
    else setActiveTab(activeTab + 1);
  };

  const isSecondLastTab = activeTab === 2;

  const handleActiveTabs = (value) => {
    setActiveTab(value)
    
  }
  
  // const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  useEffect(() => {
    if (!user || user.length === 0) {
      dispatch(getUserRequest());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user[0]?.addresses && !defaultUserAddress) {
      if (!isDefaultSet) {
        const defaultAddr = user[0]?.addresses?.find((addr) => addr.isDefault.toLowerCase() === "true");
        if (defaultAddr) {
          dispatch(setDefaultUserAddress(defaultAddr));
          setSelectedAddress(defaultAddr);
          setIsDefaultSet(true);
        }
      } else {
        navigate("/");
      }
      
    //   if (!isDefaultSet) {
    //     // Check if there is a default address and set it as selected
    //     const defaultAddress = user[0]?.addresses?.find(
    //       (address) => address.isDefault.toLowerCase() === "true"
    //     );
    //     if (defaultAddress) {
    //       setSelectedAddress(defaultAddress);
    //       setIsDefaultSet(true);
    //     }
    //   }
    // } else {
    //   navigate("/");
    }
  // }, [user.length > 0, dispatch, navigate, isDefaultSet]);
  // }, [user, dispatch, navigate, isDefaultSet]);
  }, [dispatch, user, defaultUserAddress]);

  const handleSelectedAddress = (address) => {
    setSelectedAddress(address);
  }

  const handleAllOfferList = () => {
    const payload = {isOpen: isOpen};
    dispatch(setAllOffetList(payload))
  }
  return (
    <div className="staticContent">
      <Helmet>
          <title>{'Your Shopping Cart | FikFis'}</title>
          <meta name="description" content={"Review your selected items before checkout. Edit quantities, apply discounts, and proceed to secure payment for a seamless shopping experience at FikFis."} />
          <meta name="keywords" content={'Your Shopping Cart | FikFis'} />
      </Helmet>
      {checkoutLoading && <div className="loadingContainer loadingPosition">
          <CircularProgress />
      </div>}
      <h4>Cart Your Items</h4>
      <div className="cartWrapper">
        <div className="leftCartItems">
          <div className="productDetailReview">
            <div className="tabs-container">
              <div className="tabs-buttons">
                <button
                  className={activeTab === 0 ? "active" : ""}
                  onClick={() => handleActiveTabs(0)}
                >
                  Items
                </button>
                <button
                  className={
                    activeTab === 1 ? "active" : activeTab < 1 ? "disabled" : ""
                  }
                  onClick={() => activeTab >= 1 && handleActiveTabs(1)}
                  disabled={activeTab < 1}
                >
                  Shipping
                </button>
                <button
                  className={
                    activeTab === 2 ? "active" : activeTab < 2 ? "disabled" : ""
                  }
                  onClick={() => activeTab >= 2 && handleActiveTabs(2)}
                  disabled={activeTab < 2}
                >
                  Payment
                </button>
                {/* <button
                  className={
                    activeTab === 3 ? "active" : activeTab < 3 ? "disabled" : ""
                  }
                  onClick={() => activeTab >= 3 && handleActiveTabs(3)}
                  disabled={activeTab < 3}
                >
                  Checkout
                </button> */}
              </div>
              <div className="tabs-content">
                <div
                  className={`tab-content productDescription ${
                    viewCartItems?.cartItems.length === 0 ? "emptyCart" : ""
                  }`}
                  ref={tabRefs[0]}
                  style={{ display: activeTab === 0 ? "block" : "none" }}
                >
                  {viewCartItems?.cartItems.length > 0 &&
                    viewCartItems.cartItems?.map((item, index) => (
                      <div className="cartProductList" key={index}>
                        <div className="leftcartListItem">
                          <img src={item?.imageUrl} alt={item?.name} />
                        </div>
                        <div className="rightcartListItem">
                          <div className="rightCartInnerLeftItems">
                            <h4>{item?.name}</h4>
                            <div className="productVariants">
                                {item.variants &&
                                  Object.entries(item.variants).map(([key, value]) => (
                                    <div key={key}>
                                      <h4>{`${key}`}</h4>
                                      <p>{`: ${value}`}</p>
                                      {/* {value.split(',').filter(Boolean).map((val, index) => (
                                        <p key={index}>{val}</p>
                                      ))} */}
                                    </div>
                                  ))
                                }
                            </div>
                            {item?.rating && (
                              <StarRating userrating={item?.rating} />
                            )}
                            <div className="priceSection">
                              {item?.discountedPrice && (
                                <p className="discount">£ {item?.discountedPrice}</p>
                              )}
                              {item?.price && (
                                <p className="original">£ {item?.price}</p>
                              )}
                              {item?.offer && (
                                <div className="offerList">
                                  <span>{item?.offer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="rightCartInnerRightItems">
                            <div className="cartInputBox">
                              <div
                                className="increase"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.sku_id, 'increase'
                                  )
                                }
                              >
                                +
                              </div>
                              <input
                                type="number"
                                name="cart"
                                min="1"
                                value={item?.cartQuantity}
                                readOnly
                              />
                              <div
                                className="decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.sku_id, 'decrease'
                                  )
                                }
                              >
                                -
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="productSizes">
                          Color: black | Size: {item.selectedSize}
                        </div> */}
                        <div className="cartActionItems">
                          <div 
                            className="icon"
                            onClick={() => ShareProduct(item.product_id)}
                          >
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
                    ))}
                  {viewCartItems?.cartItems.length === 0 && (
                    <div className="emptyCart">
                      <p>Your Cart is Empty</p>
                    </div>
                  )}
                  {viewCartItems?.cartItems === undefined && (<p>Your cart is Empty.</p>)}
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[1]}
                  style={{ display: activeTab === 1 ? "block" : "none" }}
                >
                    <div className="userAddresses">
                      <h4>Shipping to</h4>
                      <div className="addressList">
                        {selectedAddress ? (
                          <ul>
                              <li>
                                <h4>{selectedAddress?.full_name}</h4>
                                <p>
                                  Full Address: {selectedAddress?.house_number}, 
                                  {selectedAddress?.street},
                                  {selectedAddress?.locality}, {selectedAddress?.country},
                                  {selectedAddress?.postcode}
                                </p>
                                <p>Phone Number: {selectedAddress?.mobile}</p>
                                <p>Email: {selectedAddress?.email}</p>
                              </li>
                          </ul>
                        ) : (
                          ""
                        )}
                      </div>
                      <h4>Other Addresses</h4>
                      <div className="ManageAllAddress">
                          {viewCartItems?.address?.id ? (
                            <div className="addressList">
                              <ul>
                                  <li
                                    onClick={() => handleSelectedAddress(viewCartItems?.address)} 
                                    className={selectedAddress && selectedAddress.id === (viewCartItems?.address?.id) ? 'active': ''}
                                  >
                                    <h4>{viewCartItems?.address?.full_name}</h4>
                                    <p>
                                      Full Address: {viewCartItems?.address?.house_number}, 
                                      {viewCartItems?.address?.street},
                                      {viewCartItems?.address?.locality}, {viewCartItems?.address?.country},
                                      {viewCartItems?.address?.postcode}
                                    </p>
                                    <p>Phone Number: {viewCartItems?.address?.mobile}</p>
                                    <p>Email: {viewCartItems?.address?.email}</p>
                                    <div className="action">
                                      {/* <p onClick={() => handleAddressModal(address)}> */}
                                      <p onClick={() => handleAddressModal(viewCartItems?.address)}>
                                        Edit |
                                      </p>
                                      <p
                                        onClick={() =>
                                          // handleRemoveAddress(address.id)
                                          handleRemoveAddress(viewCartItems?.address?.id)
                                        }
                                      >
                                        Remove |
                                      </p>
                                      <p onClick={() => handleAddress()}>Add New |</p>
                                      <p
                                        onClick={() =>
                                          // handleSetDefaultAddress(address.id)
                                          handleSetDefaultAddress(viewCartItems?.address?.id)
                                        }
                                        className={viewCartItems?.address?.isDefault === "True" ? "default" : ""}
                                      >
                                        {viewCartItems?.address?.isDefault.toLowerCase() === 'true'
                                          ? "Default"
                                          : "Set as Default"}
                                      </p>
                                    </div>
                                  </li>
                              </ul>
                            </div>
                              ) : (
                                ""
                          )}
                        <div className="addressList">
                          {user[0]?.addresses?.length > 0 && (
                            <ul>
                              {user[0]?.addresses
                              .filter(address => address.id != viewCartItems?.address?.id)
                              .map((address) => (
                                <li 
                                  key={address.id} 
                                  onClick={() => handleSelectedAddress(address)} 
                                  className={selectedAddress && selectedAddress.id === address.id ? 'active': ''}
                                >
                                  <h4>{address.full_name}</h4>
                                  <p>
                                    Full Address: {address.house_number}, {address.street},
                                    {address.locality}, {address.postcode}
                                  </p>
                                  <p>Phone Number: {address.mobile}</p>
                                  <p>Email: {address.email}</p>
                                  <div className="action">
                                    <p onClick={() => handleAddressModal(address)}>Edit |</p>
                                    <p onClick={() => handleRemoveAddress(address.id)}>
                                      Remove |
                                    </p>
                                    <p onClick={() => handleAddress()}>Add New |</p>
                                    <p onClick={() => handleSetDefaultAddress(address.id)}>
                                      {address.isDefault.toLowerCase() === 'true'
                                        ? "Default"
                                        : "Set as Default"}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {(viewCartItems?.address?.id === "" || user[0]?.addresses?.length === 0) && (
                          <div className="addAddress">
                            <button type="button" onClick={() => handleAddress()}>
                              Add Address
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  {cartItems.length > 0 &&
                    cartItems.map((item, index) => (
                      <div className="cartProductList">
                        <div className="leftcartListItem">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="rightcartListItem">
                          <div className="rightCartInnerLeftItems">
                            <h4>{item.name}</h4>
                            {item.rating && (
                              <StarRating userrating={item.rating} />
                            )}
                            <div className="priceSection">
                              {item.discount && (
                                <p className="discount">$ {item.discount}</p>
                              )}
                              {item.original && (
                                <p className="original">$ {item.original}</p>
                              )}
                              {item.discountlabel && (
                                <div className="offerList">
                                  <span>{item.discountlabel}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="rightCartInnerRightItems">
                            <div className="cartInputBox">
                              <div
                                className="increase"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </div>
                              <input
                                type="number"
                                name="cart"
                                min="1"
                                value={item.quantity}
                                readOnly
                              />
                              <div
                                className="decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="productSizes">
                          Color: black | Size: {item.selectedSize}
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
                    ))}
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[2]}
                  style={{ display: activeTab === 2 ? "block" : "none" }}
                >
                  <div className="userAddresses">
                    <h4>Shipping to</h4>
                    <div className="addressList">
                      {selectedAddress ? (
                        <ul>
                          {/* {viewCartItems?.address.map((address) => ( */}
                            <li>
                              <h4>{selectedAddress?.full_name}</h4>
                              <p>
                                Full Address: {selectedAddress?.house_number}, 
                                {selectedAddress?.street},
                                {selectedAddress?.locality}, {selectedAddress?.country},
                                {selectedAddress?.postcode}
                              </p>
                              <p>Phone Number: {selectedAddress?.mobile}</p>
                              <p>Email: {selectedAddress?.email}</p>
                            </li>
                          {/* ))} */}
                        </ul>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {viewCartItems?.cartItems.length > 0 &&
                    viewCartItems.cartItems?.map((item, index) => (
                      <div className="cartProductList" key={index}>
                        <div className="leftcartListItem">
                          <img src={item?.imageUrl} alt={item?.name} />
                        </div>
                        <div className="rightcartListItem">
                          <div className="rightCartInnerLeftItems">
                            <h4>{item?.name}</h4>
                            {item?.rating && (
                              <StarRating userrating={item?.rating} />
                            )}
                            <div className="priceSection">
                              {item?.discountedPrice && (
                                <p className="discount">£ {item?.discountedPrice}</p>
                              )}
                              {item?.price && (
                                <p className="original">£ {item?.price}</p>
                              )}
                              {item?.offer && (
                                <div className="offerList">
                                  <span>{item?.offer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="rightCartInnerRightItems">
                            <div className="cartInputBox">
                              <div
                                className="increase"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.sku_id, 'increase'
                                  )
                                }
                              >
                                +
                              </div>
                              <input
                                type="number"
                                name="cart"
                                min="1"
                                value={item?.cartQuantity}
                                readOnly
                              />
                              <div
                                className="decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.sku_id, 'decrease'
                                  )
                                }
                              >
                                -
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="productSizes">
                          Color: black | Size: {item.selectedSize}
                        </div> */}
                        <div className="cartActionItems">
                          <div 
                            className="icon"
                            onClick={() => ShareProduct(item.product_id)}
                          >
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
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightCartItems">
          <div className="rightCartUpItems">
            <h3>Order Summary</h3>
            <div className="orderPriceBox">
              <div className="list">
                <p>Item(s) total:</p> <span>£ {viewCartItems?.cartPrice?.subtotalCartAmount || 0.00}</span>
              </div>
              <div className="list">
                <p>Item(s) Discount:</p> <span>£ {viewCartItems?.cartPrice?.discount || 0.00}</span>
              </div>
              <div className="list">
                {/* <p>Delivery:</p> <span>£ {viewCartItems?.cartPrice?.deliveryCharge?.toFixed(2) || 0.00}</span> */}
                <p>Delivery:</p> <span>£ {viewCartItems?.cartPrice?.deliveryCharge || 0.00}</span>
              </div>
              <div className="list">
                <p>Tax:</p> <span>£ {viewCartItems?.cartPrice?.tax || 0.00}</span>
              </div>
              <div className="list final">
                <h4>Total: </h4> <span>£ {viewCartItems?.cartPrice?.totalAmount || 0.00}</span>
              </div>
            </div>
            {activeTab === 2 && 
            <>
              <div className="applyPromoSection">
                <input
                  type="text"
                  placeholder="Apply Promo Code"
                  name="Promo Code"
                  onChange={(e) => setCoupenCode(e.target.value)}
                />
                <button type="button" className="promocode" onClick={handleApplyPromoCode}>
                  Apply
                </button>
              </div>
              <p className="availablePromo" onClick={() => handleAllOfferList()}>Check Offers</p>
            </>}
            {isSecondLastTab && (
              <ul className="paymentOption">
                {paymentOptions.map((size) => (
                  <li key={size.id}>
                    <label className="round">
                      <input type="radio" name="size" value={size.label} checked={true} />
                      <span>{size.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <div className="continue">
              <button type="button" onClick={handleNextTab}>
                {isSecondLastTab ? "Checkout" : "Continue"}
              </button>
              {errorMessage && <p className="cartError">{errorMessage}</p>}
            </div>
          </div>
          {viewCartItems?.fikfisCommitment?.length > 0 && (
            <div className="commitment">
              <h4>FikFis Commitments</h4>
              <ul>
                {viewCartItems?.fikfisCommitment?.length > 0 && viewCartItems?.fikfisCommitment
                  ? viewCartItems?.fikfisCommitment.map((data, index) => (
                      <li key={index}>{data}</li>
                    ))
                  : ""}
              </ul>
            </div>
          )}
          {viewCartItems?.availableOffers?.length > 0 && (
            <div className="availableOffers">
              <h4>Available Offers</h4>
              <ul>
                {viewCartItems?.availableOffers?.length > 0 && viewCartItems?.availableOffers
                  ? viewCartItems?.availableOffers.map((data, index) => (
                      <li key={index}>{data}</li>
                    ))
                  : ""}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
