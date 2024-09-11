import React, { useRef, useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import StarRating from "../../components/StarRating/StarRating";
import { updateQuantity, removeItem } from "../../store/slice/cartSlice";

const Cart = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  console.log(cartItems);

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  // Function to remove an item
  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const calculateTotals = () => {
    const itemTotal = cartItems.reduce(
      (acc, item) => acc + item.original * item.quantity,
      0
    );
    const itemDiscount = cartItems.reduce(
      (acc, item) =>
        acc +
        (item.discount ? (item.original - item.discount) * item.quantity : 0),
      0
    );
    const delivery = 10; // Static delivery charge
    const tax = 10; // Static tax
    const total = itemTotal - itemDiscount + delivery + tax;

    return { itemTotal, itemDiscount, delivery, tax, total };
  };

  const { itemTotal, itemDiscount, delivery, tax, total } = calculateTotals();

  return (
    <div className="staticContent">
      <h4>Cart Your Items</h4>
      <div className="cartWrapper">
        <div className="leftCartItems">
          <div className="productDetailReview">
            <div className="tabs-container">
              <div className="tabs-buttons">
                <button
                  className={activeTab === 0 ? "active" : ""}
                  onClick={() => setActiveTab(0)}
                >
                  Items
                </button>
                <button
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => setActiveTab(1)}
                >
                  Shipping
                </button>
                <button
                  className={activeTab === 2 ? "active" : ""}
                  onClick={() => setActiveTab(2)}
                >
                  Payment
                </button>
                <button
                  className={activeTab === 3 ? "active" : ""}
                  onClick={() => setActiveTab(3)}
                >
                  Confirmation
                </button>
              </div>
              <div className="tabs-content">
                <div
                  className="tab-content productDescription"
                  ref={tabRefs[0]}
                  style={{ display: activeTab === 0 ? "block" : "none" }}
                >
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
                            <div class="cartInputBox">
                              <div
                                class="increase"
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
                                class="decrease"
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
                  {cartItems.length === 0 && (
                    <div className="emptyCart">
                      <p>Your Cart is Empty</p>
                    </div>
                  )}
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[1]}
                  style={{ display: activeTab === 1 ? "block" : "none" }}
                >
                  <div className="userAddresses">
                    <h4>Shipping to</h4>
                    <div className="addAddress">
                      <button type="button">Add Address</button>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[2]}
                  style={{ display: activeTab === 2 ? "block" : "none" }}
                >
                  sdfsadfa
                </div>
                <div
                  className="tab-content"
                  ref={tabRefs[3]}
                  style={{ display: activeTab === 3 ? "block" : "none" }}
                >
                  sdfsadfa
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
                <p>Item(s) total:</p> <span>$ {itemTotal}</span>
              </div>
              <div className="list">
                <p>Item(s) Discount:</p> <span>$ {itemDiscount}</span>
              </div>
              <div className="list">
                <p>Delivery:</p> <span>$ {delivery}</span>
              </div>
              <div className="list">
                <p>Tax:</p> <span>$ {tax}</span>
              </div>
              <div className="list final">
                <h4>Total: </h4> <span>$ {total}</span>
              </div>
            </div>
            <div className="applyPromoSection">
              <input
                type="text"
                placeholder="Apply Promo Code"
                name="Promo Code"
              />
              <button type="button" className="promocode">
                Apply
              </button>
            </div>
            <div className="continue">
              <button type="button">Continue</button>
            </div>
          </div>
          {cartItems.length > 0 && (
            <div className="commitment">
              <h4>FikFis Commitments</h4>
              <ul>
                {cartItems.length > 0 && cartItems[0].commitment
                  ? cartItems[0].commitment.map((data, index) => (
                      <li key={index}>{data.name}</li>
                    ))
                  : ""}
              </ul>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="availableOffers">
              <h4>Available Offers</h4>
              <ul>
                {cartItems.length > 0 && cartItems[0].availableOffers
                  ? cartItems[0].availableOffers.map((data, index) => (
                      <li key={index}>{data.name}</li>
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
