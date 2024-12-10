import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderDetailData, OrderListData } from '../../store/slice/api_integration';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import ReactPaginate from 'react-paginate';
import { formatDateTimeProduct } from '../../utils/FormatDateTime';

const CancelledOrders = () => {
    const [cancelPage, setCancelPage] = useState(0);  // Default page 0 (first page)
    const [cancelItemsPerPage, setCancelItemsPerPage] = useState(1);
    const [cancelOrderIndex, setCancelOrderIndex] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState({ cancelled: true });
    const { 
      orderList, 
      orderDetail, 
      cancelledOrderListCount = 0,
    } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // =========================================================
    // Pagination code for Cancel order List 
    useEffect(() => {
        if(isInitialLoad.cancelled) {
          setIsInitialLoad((prev) => ({
            ...prev,
            cancelled: false,
          }));
          return;
        }

        // Extract parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || cancelItemsPerPage;
      
        // Update state with URL parameters
        setCancelPage(pageParam - 1); // Sync pagination (0-based indexing)
        setCancelItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        // Dispatch the API call with updated parameters
        const responseObj = {
          status: 3,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj));
      }, [location.search, cancelItemsPerPage ,dispatch]);  
      
      // Handle dropdown change for itemsPerPage
      const handleCancelItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setCancelItemsPerPage(newItemsPerPage);
        setCancelPage(0); // Reset to the first page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", 1);
        searchParams.set("itemsPerPage", newItemsPerPage);
        navigate(`?${searchParams.toString()}`);
      };
      
      // Handle page change for pagination
      const handleCancelPageChange = (data) => {
        const { selected } = data; // `react-paginate` provides 0-based page index
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", selected + 1); // Convert to 1-based indexing
        navigate(`?${searchParams.toString()}`); // Update URL
      };
  
      // Dropdown options for itemsPerPage
      const cancelItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= cancelledOrderListCount);
    // =========================================================
    //   download PDF
    const downloadPDF = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
    const handleCancelledViewOrderDetails = (e, index, order) => {
        e.preventDefault();
        setCancelOrderIndex((prevIndex) => {
          // If closing the current active index, return null to hide details
          if (prevIndex === index) {
            return null;
          }
      
          // If opening a new order, trigger the API call
          if (prevIndex !== index) {
            const responseObj = {
              order_id:order?.order_id,
              type: 3,
            }
            // Call your API function
            dispatch(OrderDetailData(responseObj))
          }
      
          return index;
        });
      };
      const handleNavigateToCancelledOrderDetail = (productList, scroll = false) => {
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
  return (
    <>
        <div className="orderListWrapper">
            <div className="orderListWrapper">
            {orderList && <div className='paginationBox'>
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={cancelItemsPerPage} onChange={handleCancelItemsPerPageChange}>
                            {cancelItemsPerPageOptions.map(option => (
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
                        pageCount={Math.max(Math.ceil(cancelledOrderListCount / cancelItemsPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(ev) => handleCancelPageChange(ev)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={cancelPage}  // Sync current page with URL
                        disabled={cancelledOrderListCount === 0} 
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
                        <p className="openReturnWindow">{`Return window open on ${item.return_date}`}</p>
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
                        className={cancelOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                            const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                            );
                            handleNavigateToCancelledOrderDetail(matchingProducts);
                        }}
                        >Buy it again</div>
                        <div onClick={(e) => handleCancelledViewOrderDetails(e, index, item)}>
                        {cancelOrderIndex === index ? "Hide order details" : "View order details"}
                        </div>
                        <div
                        className={cancelOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                            const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                            );
                            handleNavigateToCancelledOrderDetail(matchingProducts, true);
                        }}
                        >write a product review</div>
                        <div onClick={() => redirectToSupport()}>Get product support</div>
                    </div>
                    </div>
                    {orderDetail && <div className={`openOrderDetails ${
                    cancelOrderIndex === index ? "show" : "hide"
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
                                <p>{order?.date}</p>
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

export default CancelledOrders