import React, { useEffect, useState } from 'react';
import './Notifications.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotificationsData, getNotificationsData } from '../../store/slice/api_integration';
import { FormatDateTime } from '../../utils/FormatDateTime';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [page, setPage] = useState(0);  // Default page 0 (first page)
    const [perPage, setPerPage] = useState(10);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { notifications, notificationCount = 0 } = useSelector(state => state.user);
    console.log("notifications", notifications);
    
    useEffect(() => {
        const responseObj = {
            offset: 1,
            limit: 20,
        }
        dispatch(getNotificationsData(responseObj))
    }, [])

    const handleClearNotification = () => {
        dispatch(clearNotificationsData());
    }

     // Pagination code for User Review List
     useEffect(() => {
        // Extract parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || perPage;
      
        // Update state with URL parameters
        setPage(pageParam - 1); // Sync pagination (0-based indexing)
        setPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        // Dispatch the API call with updated parameters
        const responseObj = {
          offset,
          limit
        }
        dispatch(getNotificationsData(responseObj));
      }, [location.search, perPage ,dispatch]);
      
      // Handle dropdown change for itemsPerPage
      const handleNotificationsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setPerPage(newItemsPerPage);
        setPage(0); // Reset to the first page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", 1);
        searchParams.set("itemsPerPage", newItemsPerPage);
        navigate(`?${searchParams.toString()}`);
      };
      
      // Handle page change for pagination
      const handleNotificationsPageChange = (data) => {
        const { selected } = data; // `react-paginate` provides 0-based page index
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", selected + 1); // Convert to 1-based indexing
        navigate(`?${searchParams.toString()}`); // Update URL
      };
  
      // Dropdown options for itemsPerPage
      const notificationsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= notificationCount);
     
  return (
    <div className="notifications">
        <h4>Notifications List</h4>
        <h6 onClick={handleClearNotification}>Clear Notification</h6>
        {notifications?.length > 0 && <div className='paginationBox'>
            <div className="itemsPerPageDropdown">
                <label>Items per page: </label>
                <select value={perPage} onChange={handleNotificationsPerPageChange}>
                    {notificationsPerPageOptions.map(option => (
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
                pageCount={Math.max(Math.ceil(notificationCount / perPage), 1)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(ev) => handleNotificationsPageChange(ev)}
                containerClassName={"pagination"}
                activeClassName={"active"}
                forcePage={page}  // Sync current page with URL
                disabled={notificationCount === 0} 
            />
            </div>
        }
        <div className="notificationBox">
            {notifications && notifications.map((notification, index) => (
                <div className="notify" key={index}>
                    <div className="leftNotification">
                        <img src={notification?.image} alt={notification?.title} />
                    </div>
                    <div className="rightNotification">
                        <h4>{notification?.title}</h4>
                        <p>{notification.message}</p>
                        <p className='date'>Date: {FormatDateTime(notification.created_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Notifications