import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import "./CancelOrderModal.css";
import { setCancelOrderModal } from "../../store/slice/cartSlice";
import { OrderListData, ReasonListData, selectedCancelProduct } from "../../store/slice/api_integration";
import { selectReason } from "../../utils/Constants";

const CancelOrderModal = () => {
  const dispatch = useDispatch();
  const modalRef = useRef(null); // Reference for modal content
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]); 
  const [error, setError] = useState(""); 
  
  const { isCancelModalOpen, reasonList, orderId, skuId } = useSelector(
    (state) => state.cart
  );
  
  const handleClickOutside = (event) => {
    // Close the modal if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  const closeModal = () => {
    dispatch(setCancelOrderModal(false));
  };
  useEffect(() => {
    // Add event listener to detect clicks outside the modal
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isCancelModalOpen) return null;

  // const handleClick = (item) => {
  //   const responseObj = {
  //     sub_category_id: item.id, 
  //     offset: 1, 
  //     limit: 10
  //   }
  //   dispatch(getProductOnSubCategory(responseObj));
  //   // const filterResponse = {sub_category_id: item.id}
  //   navigate(`/productlist?subcategory_id=${item.id}`);
  // }

  const handleReasonChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedReason(selectedValue); // Update state with the selected value
    console.log("Selected Reason:", selectedValue); // Log selected value
    const responseObj = { type: selectedValue };
    dispatch(ReasonListData(responseObj)).finally(() => {
      setSelectedOptions([]);
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((item) => item.key === id);
      if (exists) {
        // Remove the object if the checkbox is unchecked
        return prev.filter((item) => item.key !== id);
      } else {
        // Add the object if the checkbox is checked
        return [...prev, { key: id }];
      }
    });
  };
  console.log("selected reason", selectedOptions);

  console.log("reasonList", reasonList);
  const handleCancelReasonModal = () => {
    setSelectedOptions([]);
    setSelectedReason("");
    setError("");
    dispatch(setCancelOrderModal(false));
  }

  const reasonIds = selectedOptions.map((item) => item.key);
  const handleResonFormSubmit = (e) => {
    e.preventDefault();
    if(selectedReason === '') {
      setError(`Please select any valid reson to cancel/return`)
      return;
    }
    if(selectedOptions.length === 0) {
      setError(`Please select any valid reson to ${selectedReason}`)
      return;
    }
    setError('');
    const responseObj = {
      type: selectedReason.toLocaleLowerCase() === 'cancel' ? 3 : 6,  // 3 for 'cancel' or 6 for 'return'
      order_id: orderId,
      sku_id: skuId,
      reason_id: reasonIds // [1,2,3]
    }
    dispatch(selectedCancelProduct(responseObj)).finally(() => {
      dispatch(setCancelOrderModal(false));
      const responseObj = {
        status: 1
      }
      dispatch(OrderListData(responseObj))
    });
  }

  return (
    <div className="reasonModal">
      <div className="modalBackdrop">
        <div className="modalContent" ref={modalRef}>
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
          <div className="allReasons">
            <h3>{selectedReason ? `Select a Reason to ${selectedReason}` : "Select a Reason"}</h3>
          </div>
          <form onSubmit={handleResonFormSubmit}>
            <div className="reasonForm">
              <div className="reasonDiv">
                <label htmlFor="Select a reason">Type:</label>
                <select value={selectedReason} onChange={handleReasonChange}>
                    <option value="" disabled selected>
                      Select a reason
                    </option>
                    {selectReason.map(option => (
                        <option key={option.id} value={option.value}>
                            {option.type}
                        </option>
                    ))}
                </select>
              </div>
              {selectedReason && <div className="reasonListDiv">
                <label>Select below Reasons</label>
                <div className="reasonFormControl">
                  { reasonList && reasonList.length > 0 ? (
                    reasonList.map((item) => (
                        <label className="round" key={item.id}>
                          <input 
                            type="checkbox" 
                            name="Reason" 
                            checked={selectedOptions.some(selected => selected.key === item.id)}
                            onChange={() => handleCheckboxChange(item.id)} 
                          />
                          <span>{item.reasons}</span>
                        </label>
                    ))
                  ) : (
                    <p>No reasons available</p>
                  )}
                  
                </div>
              </div>}
              <div className="reasonButton">
                <button type="button" onClick={handleCancelReasonModal}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
              <p className="error">{error}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
