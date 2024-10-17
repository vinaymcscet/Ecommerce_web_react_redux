import React, { useEffect, useState } from "react";
import InputField from "../InputBox/InputBox";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setModalType,
  toggleModal,
  setLogin,
  setSignup,
  setOtp,
  setForgotPassword,
} from "../../store/slice/modalSlice";
import "./Modal.css";
import { getDeviceType } from "../../utils/CheckDevice";
import { 
      device_token, 
      EMAIL_OR_MOBILE, 
      fcm_token, 
      PASSWORD, 
      PASSWORD_NOT_MATCH_ERROR, 
      VALID_OTP, 
      EMAIL_OR_MOBILE_LABEL, 
      EMAIL_LABEL,
      PASSWORD_LABEL,
      PASSWORD_TYPE,
      NEW_PASSWORD_LABEL,
      NEW_PASSWORD,
      CONFIRM_PASSWORD_LABEL,
      CONFIRM_PASSWORD,
      PASSWORD_NOT_MATCH_MESSAGE,
      NEW_PASSWORD_ENTER,
      TEMP_CODE_LABEL,
      OTP_NAME,
      TEMP_CODE_PLACEHOLDER,
      OTP_ERROR
  } from "../../utils/Constants";
import { loginUser, signupUser, signupUserWithOtp } from "../../store/slice/api_integration";

const Modal = () => {
  const dispatch = useDispatch();
  const {
    isModalOpen,
    modalType,
    login,
    signup,
    otp,
    forgotPassword,
    loading,
  } = useSelector((state) => state.modal);
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberMeError, setRememberMeError] = useState(""); 

  useEffect(() => {
    if (modalType === "login" && !login.userPhoneOrEmail && !login.password) {
      dispatch(
        setLogin({
          userPhoneOrEmail: login.userPhoneOrEmail || "",
          password: login.password || "",
        })
      );
    } else if (
      modalType === "signup" &&
      !signup.userPhoneOrEmail &&
      !signup.password
    ) {
      dispatch(
        setSignup({
          userPhoneOrEmail: signup.userPhoneOrEmail || "",
          password: signup.password || "",
        })
      );
    }
  }, [
    modalType,
    login.userPhoneOrEmail,
    login.password,
    signup.userPhoneOrEmail,
    signup.password,
    dispatch,
  ]);
  

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (modalType === "login") {
      dispatch(setLogin({ ...login, [name]: value }));
    } else if (modalType === "signup") {
      dispatch(setSignup({ ...signup, [name]: value }));
    } else if (modalType === "otp") {
      dispatch(setOtp({ otpCode: value }));
    }
    if (modalType === "forgot") {
      if (forgotPassword[name] !== value) {
        dispatch(setForgotPassword({ ...forgotPassword, [name]: value }));
      }
    }
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword ? "" : PASSWORD_NOT_MATCH_ERROR;
  };

  const validatePasswordLength = (value) => {
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  return passwordRegex.test(value)
    ? ""
    : PASSWORD;

  };

  const validateContact = (value) => {
    const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    const mobilePattern = /^\d{10}$/; // Assuming a 10-digit mobile number

    if (!emailPattern.test(value) && !mobilePattern.test(value)) {
      return EMAIL_OR_MOBILE;
    }

    return "";
  };

  const validateOtp = (value) => {
    const otpPattern = /^\d{6}$/;
    if (!otpPattern.test(value)) {
      return VALID_OTP;
    }
    return "";
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rememberMe) {
      setRememberMeError("Please check Remember Me to proceed");
      return;
    } 
    console.log("signup data ", signup);

    // Submit form data
    if (modalType === "signup") {
      const responseObj = { username: signup.userPhoneOrEmail };
      dispatch(signupUser(responseObj));
    }

    if (modalType === "otp") {
      const responseObj = { 
        username: signup.userPhoneOrEmail,
        password: signup.password,
        otp: otp.otpCode,
        device_type: getDeviceType(),
        device_token: device_token,
        fcm_token: fcm_token
      }
      dispatch(signupUserWithOtp(responseObj));
    }
    const passwordError = validatePasswordLength(forgotPassword.newPassword);
    const confirmPasswordError = validatePasswordMatch(
      forgotPassword.newPassword,
      forgotPassword.confirmPassword
    );

    if (!passwordError && !confirmPasswordError) {
      // Handle form submission
    } else {
      // Handle form validation errors
    }
    if (modalType === "forgot") {
      dispatch(setModalType("otp"));
    }
    if (modalType === "login") {
      const responseObj = { 
        username: login.userPhoneOrEmail,
        password: login.password,
        device_token: device_token,
        fcm_token: fcm_token
      }
      dispatch(loginUser(responseObj));
    }
  };
  
  const openModal = (type) => {
    dispatch(setModalType(type));
    dispatch(toggleModal(true));
  };
  const closeModal = () => {
    dispatch(toggleModal(false));
  };
  return (
    <div>
      <div className="modalBackdrop">
        <div className="modalContent">
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
          {modalType === "signup" && (
            <>
              <div className="left">
                <h4>Sign Up</h4>
                <p>
                  Just enter your email or mobile number, and we'll send you a
                  text message with a temporary code.
                </p>
                <div className="name">Welcome to FikFis</div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <InputField
                    label = {EMAIL_OR_MOBILE_LABEL}
                    placeholder= {EMAIL_OR_MOBILE_LABEL}
                    name={EMAIL_LABEL}
                    value={signup.userPhoneOrEmail}
                    onChange={handleChange}
                    required
                    validate={validateContact}
                    errorMessage={EMAIL_OR_MOBILE}
                  />
                  <InputField
                    label={PASSWORD_LABEL}
                    placeholder={PASSWORD_LABEL}
                    type={PASSWORD_TYPE}
                    name={PASSWORD_TYPE}
                    value={signup.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    validate={validatePasswordLength}
                    errorMessage={PASSWORD}
                  />
                  <button
                    type="submit"
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading && (
                      <img
                        src="/images/loader1.svg"
                        alt="Loader Image"
                        style={{ display: "flex", margin: "auto" }}
                      />
                    )}
                    {!loading && <span>Submit</span>}
                  </button>
                  <ul className="status">
                    <li>
                      By continuing, you agree to FikFis Terms of Use and
                      Privacy Policy.
                    </li>
                    <li>
                      To verify your number, we will send you a text message
                      with a temporary code.
                    </li>
                  </ul>
                </form>
                <div className="name">
                  Already have an account?
                  <a onClick={() => openModal("login")}> Login</a>
                </div>
              </div>
            </>
          )}
          {modalType === "login" && (
            <>
              <div className="left">
                <h4>Login</h4>
                <p>Get access to your Orders, wishlist, and Recommendations.</p>
                <div className="name">Welcome Back to FikFis</div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <InputField
                    label={EMAIL_OR_MOBILE_LABEL}
                    placeholder={EMAIL_OR_MOBILE_LABEL}
                    name={EMAIL_LABEL}
                    value={login.userPhoneOrEmail}
                    onChange={handleChange}
                    required
                    validate={validateContact}
                    errorMessage={EMAIL_OR_MOBILE}
                  />
                  <InputField
                    label={PASSWORD_LABEL}
                    placeholder={PASSWORD_LABEL}
                    type={PASSWORD_TYPE}
                    name={PASSWORD_TYPE}
                    value={login.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    validate={validatePasswordLength}
                    errorMessage={PASSWORD}
                  />
                  <div className="authentication">
                    <label className="round">
                      <input 
                        type="checkbox" 
                        name="rememberMe" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)} 
                      />
                      <span>Remember Me</span>
                    </label>
                    <div className="forgotLink">
                      <Link onClick={() => openModal("forgot")}>
                        Forgot Password
                      </Link>
                    </div>
                  </div>
                  {rememberMeError && <span className="forgot-link error-message">
                      {rememberMeError}
                  </span>}
                  <button type="submit">SUBMIT</button>
                  {/* <div className="partition">Or</div>
                  <div className="socialInt">
                    <div className="box facebook">
                      <img
                        src="/images/icons/facebook-social.svg"
                        alt="Facebook Login"
                      />
                      <span>Facebook</span>
                    </div>
                    <div className="box google">
                      <img
                        src="/images/icons/google-social.svg"
                        alt="Google Login"
                      />
                      <span>Google</span>
                    </div>
                  </div> */}
                </form>
                <div className="name">
                  Don’t have an account?
                  <a onClick={() => openModal("signup")}> Sign Up</a>
                </div>
              </div>
            </>
          )}
          {modalType === "otp" && (
            <>
              <div className="left">
                <h4>Password Assistance</h4>
                <p>Please enter the temporary code sent via text message.</p>
                <div className="name">
                  Need help?
                  <a href="mailto:support@fikfis.uk">support@fikfis.uk</a>
                </div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <InputField
                    label={TEMP_CODE_LABEL}
                    placeholder={TEMP_CODE_PLACEHOLDER}
                    name={OTP_NAME}
                    value={otp.otpCode}
                    onChange={handleChange}
                    validate={validateOtp}
                    required
                    errorMessage={OTP_ERROR}
                  />
                  <button
                    type="submit"
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading && (
                      <img
                        src="/images/loader1.svg"
                        alt="Loader Image"
                        style={{ display: "flex", margin: "auto" }}
                      />
                    )}
                    {!loading && <span>Submit</span>}
                  </button>
                </form>
              </div>
            </>
          )}
          {modalType === "forgot" && (
            <>
              <div className="left">
                <h4>Create Password</h4>
                <p>Your password must be a minimum of 8 characters long.</p>
                <div className="name">
                  Need help?
                  <a href="mailto:support@fikfis.uk">support@fikfis.uk</a>
                </div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <InputField
                    label={NEW_PASSWORD_LABEL}
                    placeholder={NEW_PASSWORD_ENTER}
                    type={PASSWORD_TYPE}
                    name={NEW_PASSWORD}
                    value={forgotPassword.newPassword}
                    onChange={handleChange}
                    required
                    validate={validatePasswordLength}
                    errorMessage={PASSWORD}
                  />
                  <InputField
                    label={CONFIRM_PASSWORD_LABEL}
                    placeholder={CONFIRM_PASSWORD_LABEL}
                    type={PASSWORD_TYPE}
                    name={CONFIRM_PASSWORD}
                    value={forgotPassword.confirmPassword}
                    onChange={handleChange}
                    required
                    validate={() =>
                      validatePasswordMatch(
                        forgotPassword.newPassword,
                        forgotPassword.confirmPassword
                      )
                    }
                    errorMessage={PASSWORD_NOT_MATCH_MESSAGE}
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
