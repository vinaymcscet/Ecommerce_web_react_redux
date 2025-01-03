import React, { useEffect, useState } from 'react';
import './Notifications.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotificationsData, getNotificationsData } from '../../store/slice/api_integration';
import { FormatDateTime } from '../../utils/FormatDateTime';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Notifications = () => {
    const [page, setPage] = useState(0);  // Default page 0 (first page)
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { notifications, notificationCount = 0 } = useSelector(state => state.user);
    
    const handleClearNotification = () => {
        dispatch(clearNotificationsData());
    }

     // Pagination code for User Review List
     useEffect(() => {
        setLoading(true)
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
        dispatch(getNotificationsData(responseObj)).finally(() => {
            setLoading(false)
        });
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
        <div className='notificationHeader'>
            <h4>Notifications List</h4>
            {notifications?.length > 0 && <div className='paginationBox'>
                {/* <div className="itemsPerPageDropdown">
                    <label>Items per page: </label>
                    <select value={perPage} onChange={handleNotificationsPerPageChange}>
                        {notificationsPerPageOptions.map(option => (
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
        </div>
        {notifications && <h6 onClick={handleClearNotification}>Clear Notification</h6>}
         {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
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
                    {notifications === null && <p className='noNotifications'>No notifications found.</p>}
                </div>
            )}
    </div>
  )
}

export default Notifications