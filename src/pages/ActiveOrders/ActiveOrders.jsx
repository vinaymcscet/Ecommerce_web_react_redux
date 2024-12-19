import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderDetailData, OrderListData } from '../../store/slice/api_integration';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { setCancelOrderModal } from '../../store/slice/cartSlice';
import ReactPaginate from 'react-paginate';
import { formatDateTimeFormatProduct, formatDateTimeProduct } from '../../utils/FormatDateTime';

const ActiveOrders = () => {
    const [activePage, setActivePage] = useState(0);  // Default page 0 (first page)
    const [activeItemsPerPage, setActiveItemsPerPage] = useState(1);
    const [activeOrderIndex, setActiveOrderIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState({ active: true });
    const { 
        orderList, 
        orderDetail, 
        activeOrderListCount = 0, 
    } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const downloadPDF = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
    // Pagination code for Active order List 
    useEffect(() => {
        if(isInitialLoad.active) {
        setIsInitialLoad((prev) => ({
            ...prev,
            active: false,
        }));
        return;
        }
        // Extract parameters from the URL
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
        dispatch(OrderListData(responseObj));
    }, [location.search, activeItemsPerPage ,dispatch]);
    
    // Handle dropdown change for itemsPerPage
    const handleActiveItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setActiveItemsPerPage(newItemsPerPage);
        setActivePage(0); // Reset to the first page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", 1);
        searchParams.set("itemsPerPage", newItemsPerPage);
        navigate(`?${searchParams.toString()}`);
    };
    
    // Handle page change for pagination
    const handleActivePageChange = (data) => {
        const { selected } = data; // `react-paginate` provides 0-based page index
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", selected + 1); // Convert to 1-based indexing
        navigate(`?${searchParams.toString()}`); // Update URL
    };

    // Dropdown options for itemsPerPage
    const activeItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= activeOrderListCount);
    // =========================================================
    const handleActiveViewOrderDetails = (e, index, order) => {
        e.preventDefault();
        setActiveOrderIndex((prevIndex) => {
          // If closing the current active index, return null to hide details
          if (prevIndex === index) {
            return null;
          }
      
          // If opening a new order, trigger the API call
          if (prevIndex !== index) {
            const responseObj = {
              order_id:order?.order_id,
              type: 1,
            }
            // Call your API function
            dispatch(OrderDetailData(responseObj))
          }
      
          return index;
        });
      };
      const handleNavigateToDetail = (productList, scroll = false) => {
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
        //   console.error("Product ID is undefined.");
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
          status: 1,
        };
        // dispatch(toggleCategoryModal(cancelOrderPayload));
        dispatch(setCancelOrderModal(cancelOrderPayload))
        // setActiveOrderIndex(null);
      }
      if(orderDetail) {
          const formattedActiveEstDeliveryDate = formatDateTimeProduct(orderDetail?.estimatedDeliveryDate);
      }
      
  return (
    <>
        <div className="orderListWrapper">
            {orderList && <div className='paginationBox'>
                <div className="itemsPerPageDropdown">
                    <label>Items per page: </label>
                    <select value={activeItemsPerPage} onChange={handleActiveItemsPerPageChange}>
                        {activeItemsPerPageOptions.map(option => (
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
                    pageCount={Math.max(Math.ceil(activeOrderListCount / activeItemsPerPage), 1)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={(ev) => handleActivePageChange(ev)}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={activePage}  // Sync current page with URL
                    disabled={activeOrderListCount === 0} 
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
                        className={activeOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                        const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                        );
                        handleNavigateToDetail(matchingProducts);
                        }}
                    >
                        Buy it again
                    </div>
                    <div onClick={(e) => handleActiveViewOrderDetails(e, index, item)}>
                        {activeOrderIndex === index ? "Hide order details" : "View order details"}
                    </div>
                    <div
                        className={activeOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                        const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                        );
                        handleNavigateToDetail(matchingProducts, true);
                        }}
                    >write a product review</div>
                    <div onClick={() => redirectToSupport()}>Get product support</div>
                    <div 
                        className={activeOrderIndex === index ? "active" : "disabled"}
                        onClick={(e) => handleCancelOrder(e, item, orderDetail.returnStatus)}
                    >
                        {"Cancel Order"}
                    </div>
                    </div>
                </div>
                {orderDetail && <div className={`openOrderDetails ${
                    activeOrderIndex === index ? "show" : "hide"
                    }`}>
                    {orderDetail && <div className="expectedDelivery">
                        <h4>Expected Delivery</h4>
                        <p>{formatDateTimeProduct(orderDetail?.estimatedDeliveryDate) 
                                ? `${formatDateTimeProduct(orderDetail?.estimatedDeliveryDate).fullDay}, 
                                    ${formatDateTimeProduct(orderDetail?.estimatedDeliveryDate).formattedDate}`: ''}</p>
                    </div>}
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
                        <h4>{orderDetail?.statusDetails[0]?.status}</h4>
                        <p>{formatDateTimeFormatProduct(orderDetail?.statusDetails[0]?.date)}</p>
                        <h4>Expected Delivery Date</h4>
                        <p>{orderDetail?.estimatedDeliveryDate}</p>
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
                        {orderDetail?.orderItems[0]?.variants?.Size && <h4>Color</h4>}
                        {orderDetail && <p className="orderColor"> {`${orderDetail?.orderItems?.map(order => (
                            order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order?.variants?.Color: ''
                        ))}`}
                        </p>}
                        {orderDetail?.orderItems[0]?.variants?.Size && 
                        <>
                            <h4>Size</h4>
                            {orderDetail?.orderItems[0]?.variants?.Size && <p className="orderColor"> {`${orderDetail?.orderItems?.map(order => (
                                order?.productName.toLowerCase() === item?.product_name.toLowerCase() ? order?.variants?.Size: ''
                            ))}`}
                        </p>}
                        </>}
                    </div>
                    </div>
                    <div className="tracking_order_status">
                        {
                        orderDetail?.statusDetails.map((item, index) => (
                            <>
                            <div className="order started done">
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
    </>
  )
}

export default React.memo(ActiveOrders)