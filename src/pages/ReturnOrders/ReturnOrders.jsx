import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderDetailData, OrderListData } from '../../store/slice/api_integration';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import ReactPaginate from 'react-paginate';
import { formatDateTimeProduct } from '../../utils/FormatDateTime';

const ReturnOrders = () => {
  const [returnPage, setReturnPage] = useState(0);  // Default page 0 (first page)
  const [returnItemsPerPage, setReturnItemsPerPage] = useState(1);
  const [returnOrderIndex, setReturnOrderIndex] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState({ returned: true });
  const { 
    orderList, 
    orderDetail, 
    returnOrderListCount = 0, 
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
    // Pagination code for Return order List 
    useEffect(() => {
        if(isInitialLoad.returned) {
          setIsInitialLoad((prev) => ({
            ...prev,
            returned: false,
          }));
          return;
        }
        // Extract parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || returnItemsPerPage;
      
        // Update state with URL parameters
        setReturnPage(pageParam - 1); // Sync pagination (0-based indexing)
        setReturnItemsPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        // Dispatch the API call with updated parameters
        const responseObj = {
          status: 6,
          offset,
          limit
        }
        dispatch(OrderListData(responseObj));
      }, [location.search, returnItemsPerPage ,dispatch]);
      
      // Handle dropdown change for itemsPerPage
      const handleReturnItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setReturnItemsPerPage(newItemsPerPage);
        setReturnPage(0); // Reset to the first page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", 1);
        searchParams.set("itemsPerPage", newItemsPerPage);
        navigate(`?${searchParams.toString()}`);
      };
      
      // Handle page change for pagination
      const handleReturnPageChange = (data) => {
        const { selected } = data; // `react-paginate` provides 0-based page index
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", selected + 1); // Convert to 1-based indexing
        navigate(`?${searchParams.toString()}`); // Update URL
      };
  
      // Dropdown options for itemsPerPage
      const returnItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= returnOrderListCount);
    // =========================================================
        
    const downloadPDF = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleReturnedViewOrderDetails = (e, index, order) => {
    e.preventDefault();
    setReturnOrderIndex((prevIndex) => {
        // If closing the current active index, return null to hide details
        if (prevIndex === index) {
        return null;
        }
    
        // If opening a new order, trigger the API call
        if (prevIndex !== index) {
        const responseObj = {
            order_id:order?.order_id,
            type: 6,
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
        // console.error("Product ID is undefined.");
    }
    };
    const redirectToSupport = () => {
    navigate("/contact");
    };
  return (
    <>
        <div className="orderListWrapper">
            {orderList && <div className='paginationBox'>
                <div className="itemsPerPageDropdown">
                    <label>Items per page: </label>
                    <select value={returnItemsPerPage} onChange={handleReturnItemsPerPageChange}>
                        {returnItemsPerPageOptions.map(option => (
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
                    pageCount={Math.max(Math.ceil(returnOrderListCount / returnItemsPerPage), 1)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={(ev) => handleReturnPageChange(ev)}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={returnPage}  // Sync current page with URL
                    disabled={returnOrderListCount === 0} 
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
                        // onClick={() => handleInvoiceDetails(item, true)}
                        onClick={() => downloadPDF(orderDetail?.invoice_url)}
                    >
                        Invoice
                    </div>}
                    <div
                        className={returnOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                        const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                        );
                        handleNavigateToDetail(matchingProducts);
                        }}
                    >Buy it again</div>
                    <div onClick={(e) => handleReturnedViewOrderDetails(e, index, item)}>
                        {returnOrderIndex === index ? "Hide order details" : "View order details"}
                    </div>
                    <div
                        className={returnOrderIndex === index ? "active" : "disabled"}
                        onClick={() => {
                        const matchingProducts = orderDetail?.orderItems?.filter((order) =>
                            order?.productName?.toLowerCase() === item?.product_name.toLowerCase()
                        );
                        handleNavigateToDetail(matchingProducts, true);
                        }}
                    >write a product review</div>
                    <div onClick={() => redirectToSupport()}>Get product support</div>
                    </div>
                </div>
                {orderDetail && <div className={`openOrderDetails ${
                    returnOrderIndex === index ? "show" : "hide"
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
                                item.status.toLowerCase() === 'returned' 
                                ? 'order started return' 
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
    </>
  )
}

export default ReturnOrders;