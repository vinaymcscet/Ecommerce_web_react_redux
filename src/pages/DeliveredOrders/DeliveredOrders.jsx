import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderDetailData, OrderListData } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';
import ReactPaginate from 'react-paginate';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { setCancelOrderModal } from '../../store/slice/cartSlice';
import { formatDateTimeFormatProduct, formatDateTimeProduct } from '../../utils/FormatDateTime';

const DeliveredOrders = () => {
    const [deliveredPage, setDeliveredPage] = useState(0);  // Default page 0 (first page)
    const [deliveredItemsPerPage, setDeliveredItemsPerPage] = useState(1);
    const [deliveredOrderIndex, setDeliveredOrderIndex] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState({ delivered: true });
    const [isOpen, setIsOpen] = useState(true);
    const { 
        orderList, 
        deliveredOrderListCount = 0,
        orderDetail,
        returnStatus,
        status
      } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
  //   download PDF
  const downloadPDF = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Pafination code for Active order List 
  useEffect(() => {
    if(isInitialLoad.delivered) {
      setIsInitialLoad((prev) => ({
        ...prev,
        delivered: false,
      }));
      return;
    }
    // Extract parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;
    const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || deliveredItemsPerPage;
  
    // Update state with URL parameters
    setDeliveredPage(pageParam - 1); // Sync pagination (0-based indexing)
    setDeliveredItemsPerPage(itemsPerPageParam);
  
    // Calculate offset and limit dynamically
    const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
    const limit = itemsPerPageParam;
  
    // Dispatch the API call with updated parameters
    const responseObj = {
      status: 5,
      offset,
      limit
    }
    dispatch(OrderListData(responseObj));
  }, [location.search, deliveredItemsPerPage ,dispatch]);
  
  // Handle dropdown change for itemsPerPage
  const handleDeliveredItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setDeliveredItemsPerPage(newItemsPerPage);
    setDeliveredPage(0); // Reset to the first page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", 1);
    searchParams.set("itemsPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
  };
  
  // Handle page change for pagination
  const handleDeliveredPageChange = (data) => {
    const { selected } = data; // `react-paginate` provides 0-based page index
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", selected + 1); // Convert to 1-based indexing
    navigate(`?${searchParams.toString()}`); // Update URL
  };

  // Dropdown options for itemsPerPage
  const deliveredItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= deliveredOrderListCount);
  // =========================================================
  const handleDeliveredViewOrderDetails = (e, index, order) => {
    e.preventDefault();
    setDeliveredOrderIndex((prevIndex) => {
      // If closing the current active index, return null to hide details
      if (prevIndex === index) {
        return null;
      }
  
      // If opening a new order, trigger the API call
      if (prevIndex !== index) {
        const responseObj = {
          order_id:order?.order_id,
          type: 5,
        }
        // Call your API function
        dispatch(OrderDetailData(responseObj))
      }
      return index;
    });
  };
  const handleNavigateToDeliveredOrderDetail = (productList, scroll = false) => {
    if (!productList || productList.length === 0) {
      return;
    }
  
    const product = productList[0];
    if (product?.product_id) {
      // navigate(`/product/${product.product_id}`, { state: { product } });
      if(scroll) {
        navigate(`/product/${product.product_id}`, { state: { product, scrollToBottom: scroll } });
      } else navigate(`/product/${product.product_id}`, { state: { product } });
    } else {
      // console.error("Product ID is undefined.");
    }
  };
  const redirectToSupport = () => {
    navigate("/contact");
  };
  const handleCancelOrder = (e, item, returnStatus) => {
    const cancelOrderPayload = { 
      isOpen: isOpen,
      orderId: item.order_id,
      skuId: item.sku_id,
      returnStatus,
      status: 5,
    };
    // dispatch(toggleCategoryModal(cancelOrderPayload));
    dispatch(setCancelOrderModal(cancelOrderPayload))
    // setDeliveredOrderIndex(null);
  }
  return (
    <>
        <div className="orderListWrapper">
            <div className="orderListWrapper">
                {orderList && <div className='paginationBox'>
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={deliveredItemsPerPage} onChange={handleDeliveredItemsPerPageChange}>
                            {deliveredItemsPerPageOptions.map(option => (
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
                        pageCount={Math.max(Math.ceil(deliveredOrderListCount / deliveredItemsPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(ev) => handleDeliveredPageChange(ev)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={deliveredPage}  // Sync current page with URL
                        disabled={deliveredOrderListCount === 0} 
                    />
                </div>
                }
            {orderList &&
                orderList?.map((item, index) => (
                <div className="orderList" key={index}>
                    <div className="orderDetail">
                    <div className="leftOrder">
                        <img src={item.product_image} alt={item.product_name} />
                        <div>
                        <h3>{item.product_name}</h3>
                        <p className="openReturnWindow">{`Return window open on ${formatDateTimeFormatProduct(item.return_date)}`}</p>
                        <p>{`Order # ${item.order_number}`}</p>
                        </div>
                    </div>
                    <div className="rightOrder">
                        {orderDetail?.invoice_url && <div
                        onClick={() => downloadPDF(orderDetail?.invoice_url)}
                        >
                        Invoice
                        </div>}
                        <div
                        className={deliveredOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                            const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                            );
                            handleNavigateToDeliveredOrderDetail(matchingProducts);
                        }}
                        >Buy it again</div>
                        <div onClick={(e) => handleDeliveredViewOrderDetails(e, index, item)}>
                        {deliveredOrderIndex === index ? "Hide order details" : "View order details"}
                        </div>
                        <div
                        className={deliveredOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                            const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                            );
                            handleNavigateToDeliveredOrderDetail(matchingProducts, true);
                        }}
                        >write a product review</div>
                        <div onClick={() => redirectToSupport()}>Get product support</div>
                        <div 
                            className={deliveredOrderIndex === index ? "active" : "disabled"}
                            onClick={(e) => handleCancelOrder(e, item, orderDetail?.returnStatus)}
                        >
                            {"Cancel Order"}
                        </div>
                    </div>
                    </div>
                    {orderDetail && <div className={`openOrderDetails ${
                    deliveredOrderIndex === index ? "show" : "hide"
                    }`}>
                    <div className="userDetails">
                        <div className="userAddress">
                        <h6>
                            SHIP To:
                            <span>{orderDetail?.shippingAddress?.name}</span>
                        </h6>
                        <p>{orderDetail?.shippingAddress?.house_number}, {orderDetail?.shippingAddress?.street}</p>
                        <p>{orderDetail?.shippingAddress?.locality}, {orderDetail?.shippingAddress?.country}</p>
                        <p>Postal Code: {orderDetail?.shippingAddress?.postcode}</p>
                        <p>Phone Number: {orderDetail?.shippingAddress?.phone}</p>
                        </div>
                        <div className="user_order_details">
                        {
                            orderDetail?.statusDetails?.map(order => (
                            <>
                                <h4>{order?.status}</h4>
                                <p>{formatDateTimeFormatProduct(order?.date)}</p>
                            </>
                            ))
                        }
                        <h4>TOTAL Quantity</h4>
                        <p>{orderDetail?.orderItems?.map(order => (
                            order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order.quantity: ''
                        ))}</p>
                        </div>
                        <div className="user_order_track">
                        <h4>TRACK ORDER</h4>
                        <p className="track">{orderDetail?.orderNumber}</p>
                        <h4>TOTAL</h4>
                        <p className="total">
                        {orderDetail?.orderItems?.map(order => (
                            order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order?.totalPrice : ''
                        ))} include taxes
                        </p>
                        {orderDetail?.orderItems[0]?.variants?.Color && <h4>Color</h4>}
                            {orderDetail && <p className="orderColor"> {`${orderDetail?.orderItems?.map(order => (
                                order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order?.variants?.Color: ''
                            ))}`}
                        </p>}
                        {orderDetail?.orderItems[0]?.variants?.Size && 
                            <>
                            <h4>Size</h4>
                            {orderDetail && <p className="orderColor"> {`${orderDetail?.orderItems?.map(order => (
                                order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order?.variants?.Size: ''
                            ))}`}
                            </p>}
                            </>}
                        </div>
                    </div>
                    <div className="tracking_order_status">
                        {
                            orderDetail?.statusDetails.map(item => (
                            <>
                                <div 
                                className={
                                    item.status.toLowerCase() === 'cancelled' 
                                    ? 'order started cancel' 
                                    : 'order started done'
                                }
                                >
                                <h6>{`${item?.status}`}</h6>
                                <p>{`${formatDateTimeProduct(item?.date).formattedDate}`}</p>
                                </div>
                            </>
                            ))
                        }
                    </div>
                    </div>}
                </div>
                ))}
                {!orderList && <p>No orders found.</p>}
            </div>
        </div>
    </>
  )
}

export default DeliveredOrders