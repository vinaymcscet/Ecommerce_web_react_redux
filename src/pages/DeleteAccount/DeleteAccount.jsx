import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import { deleteAccountReason } from '../../utils/Constants';
import { getDeleteAccount, getUserRequest } from '../../store/slice/api_integration';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

const DeleteAccount = () => {
    const [isFetched, setIsFetched] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        deletionReason: "",
    });
    const [errors, setErrors] = useState({});
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();    

    // useEffect(() => {
    //     if (!isFetched && (!user || user.length === 0)) {
    //         dispatch(getUserRequest());
    //         setIsFetched(true);
    //     } else if (!user || Object.keys(user).length === 0) {
    //         navigate('/');
    //     }
    // }, [isFetched, user, dispatch, navigate]);
    useEffect(() => {
        dispatch(getUserRequest());
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if (name === "phone" && /^\d+$/.test(value) && !value.startsWith("+44")) {
            updatedValue = `+44${value}`;
        }
        setFormData({
        ...formData,
        [name]: updatedValue,
        });
    };

    const validate = () => {
        let formErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            formErrors.fullName = "Full Name is required";
        }

        // Email validation
        if (!formData.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Email address is invalid";
        }

        // Phone validation
        if (!formData.phone.trim()) {
            formErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone) && !formData.phone.startsWith("+44")) {
            formErrors.phone = "Phone number is invalid, should be 10 digits and start with +44";
        }

        if (!formData.deletionReason) {
            formErrors.deletionReason = "Deletion reason is required";
        }

        if (!rememberMe) {
            formErrors.rememberMe = "You must confirm your account deletion";
        }

        return formErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const responseObj = {
                name: formData.fullName,
                email: formData.email,
                mobile: formData.phone,
                reason: formData.deletionReason
            };
            dispatch(getDeleteAccount(responseObj));
            setErrors({});
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                deletionReason: "",
            })
            setRememberMe(false);
        }
    }
    return (
        <div className='deleteAccount'>
            <h6>Delete Account</h6>
            <div className="contactForm">
                <form onSubmit={handleSubmit}>
                    <div className="box">
                        <div className="form-control">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <p className="error">{errors.fullName}</p>}
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">Email Id</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="box">
                        <div className="form-control">
                            <label htmlFor="phone">Mobile/Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="error">{errors.phone}</p>}
                        </div>
                        <div className="form-control">
                            <label htmlFor="phone">Deletion Reason</label>
                            <select 
                                name="deletionReason" 
                                id="deletionReason" 
                                placeholder="Select Deletion Reason"
                                value={formData.deletionReason}
                                onChange={handleChange}
                            >
                                <option value="">Select Deletion Reason</option>
                                {deleteAccountReason && deleteAccountReason.map(reason => (
                                    <>
                                        <option value={reason.value}>{reason.value}</option>
                                    </>
                                ))
                                }
                                
                            </select>
                            {errors.deletionReason && <p className="error">{errors.deletionReason}</p>}
                        </div>
                    </div>
                    
                    <div className="box ">
                        <div className="notefrm">
                            <p>Are you sure you want to delete the account?</p>
                            <p>Once you delete the account, there is no going back. Please be certain</p>
                        </div>
                    </div>

                    <div className="box">
                        <div className="authentication">
                            <label className="round">
                                <input 
                                    type="checkbox" 
                                    name="rememberMe" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                />
                                <span>I confirm my account deletion</span>
                            </label>
                            {errors.rememberMe && <p className="error">{errors.rememberMe}</p>}
                        </div>
                    </div>
                    <Button
                        type={"submit"}
                        value={"submit"}
                        varient="explore contact"
                        space="sp-10"
                    />
                </form>
            </div>
        </div>
    )
}

export default DeleteAccount