import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close"
import { useDispatch, useSelector } from 'react-redux';
import { getOfferList } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';
import './CoupensModal.css';
import { setAllOffetList } from '../../store/slice/cartSlice';

const CoupensModal = () => {
    const [copyMessage, setCopyMessage] = useState({ message: "", index: null });
    const { offerList } = useSelector((state) => state.product);
    const { isAllOfferList } = useSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const modalRef = useRef(null); 
    
    useEffect(() => {
        if (isAllOfferList) {
            setLoading(true);
            dispatch(getOfferList()).finally(() => {
                setLoading(false);
            });
        }
    }, [dispatch, isAllOfferList])

    const handleClickOutside = (event) => {
        // Close the modal if the click is outside the modal content
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };
    useEffect(() => {
        // Add event listener to detect clicks outside the modal
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Remove event listener on component unmount
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const closeModal = () => {
        dispatch(setAllOffetList(false));
    };
    const handleCopy = (title, index) => {
        // Copy the item.title to the clipboard
        navigator.clipboard
            .writeText(title)
            .then(() => {
            // Set success message
            setCopyMessage({ message: "Item copied to clipboard!", index });

            // Hide message after 2 minutes (120,000 milliseconds)
            setTimeout(() => {
                setCopyMessage({ message: "", index: null });
            }, 2000); // 2 minutes
            })
            .catch((err) => {
            });
    };
    
    if (!isAllOfferList) return null;
  return (
    <>
    <div className="offerModal">
      <div className="modalBackdrop">
        <div className="modalContent" ref={modalRef}>
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
          {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
            <div className="coupens">
                <h3>Hurry Up!!! </h3>
                <div className="coupensList">
                {offerList && offerList.map((item, index) => (
                    <div className="availableCoupen" key={index}>
                        {copyMessage.index === index && (
                        <p className="selectedCopiedMessage">
                            {copyMessage.message}
                        </p>
                        )}
                        <div
                        className="copySelection"
                        onClick={() => handleCopy(item.coupon_code, index)}
                        >
                        <img src="/images/icons/copy.svg" alt="copy Item" />
                        </div>
                        <h4>{item.coupon_title}</h4>
                        <p>{item.description}</p>
                        {item.term_of_use &&  (<ul>
                            <li dangerouslySetInnerHTML={{__html: item.term_of_use}} />
                        </ul>)
                        }                      
                        <p className="validity">Validity: {item.valid_from} to {item.valid_till}</p>
                    </div>
                    ))}
                {!offerList && <p>No Coupens available now</p>}
                </div>
            </div>
        )}
        </div>
      </div>
    </div>
</>
  )
}

export default CoupensModal