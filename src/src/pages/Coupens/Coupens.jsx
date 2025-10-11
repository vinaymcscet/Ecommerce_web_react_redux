import React, { useEffect, useState } from 'react';
import './Coupens.css';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getOfferList } from '../../store/slice/api_integration';

const Coupens = () => {
    const [copyMessage, setCopyMessage] = useState({ message: "", index: null });
    const { offerList } = useSelector((state) => state.product);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

    useEffect(() => {
        setLoading(true);
        dispatch(getOfferList()).finally(() => {
            setLoading(false);
        });
    }, [])
  return (
    <>
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
    </>
  )
}

export default Coupens