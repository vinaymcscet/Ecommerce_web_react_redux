import React, { useEffect } from "react";
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

const Modal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, modalType, login, signup, otp, forgotPassword } =
    useSelector((state) => state.modal);

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
    return password === confirmPassword ? "" : "Passwords do not match.";
  };

  const validatePasswordLength = (value) => {
    return value.length >= 6
      ? ""
      : "Password must be at least 6 characters long.";
  };

  const validateContact = (value) => {
    const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    const mobilePattern = /^\d{10}$/; // Assuming a 10-digit mobile number

    if (!emailPattern.test(value) && !mobilePattern.test(value)) {
      return "Please enter a valid email address or mobile number.";
    }

    return "";
  };

  const validateOtp = (value) => {
    const otpPattern = /^\d{6}$/;
    if (!otpPattern.test(value)) {
      return "Please enter a valid 6-digit OTP.";
    }
    return "";
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    if (modalType === "signup") {
      dispatch(setModalType("otp"));
    }
    if (modalType === "otp") {
      dispatch(toggleModal(false));
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
                    label="Email or mobile phone number"
                    placeholder="Email or mobile phone number"
                    name="userPhoneOrEmail"
                    value={signup.userPhoneOrEmail}
                    onChange={handleChange}
                    required
                    validate={validateContact}
                    errorMessage="Please enter a valid email address or mobile number."
                  />
                  <InputField
                    label="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={signup.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button type="submit">Submit</button>
                  <p className="status">
                    <ul>
                      <li>
                        By continuing, you agree to FikFis Terms of Use and
                        Privacy Policy.
                      </li>
                      <li>
                        To verify your number, we will send you a text message
                        with a temporary code.
                      </li>
                    </ul>
                  </p>
                </form>
                <div className="name">
                  Already have an account?
                  <a onClick={() => openModal("login")}>Login</a>
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
                    label="Email or mobile phone number"
                    placeholder="Email or mobile phone number"
                    name="userPhoneOrEmail"
                    value={login.userPhoneOrEmail}
                    onChange={handleChange}
                    required
                    validate={validateContact}
                    errorMessage="Please enter a valid email address or mobile number."
                  />
                  <InputField
                    label="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <div className="authentication">
                    <label className="round">
                      <input type="checkbox" name="checkbox" />
                      <span>Remember Me</span>
                    </label>
                    <div className="forgotLink">
                      <Link onClick={() => openModal("forgot")}>
                        Forgot Password
                      </Link>
                    </div>
                  </div>
                  <button type="submit">SUBMIT</button>
                  <div className="partition">Or</div>
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
                  </div>
                </form>
                <div className="name">
                  Don’t have an account?
                  <a onClick={() => openModal("signup")}>Sign Up</a>
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
                    label="Temporary code (OTP)"
                    placeholder="Enter a temporary code"
                    name="otpCode"
                    value={otp.otpCode}
                    onChange={handleChange}
                    validate={validateOtp}
                    required
                    errorMessage="Please enter a valid 6-digit OTP"
                  />
                  <button type="submit">SUBMIT</button>
                </form>
              </div>
            </>
          )}
          {modalType === "forgot" && (
            <>
              <div className="left">
                <h4>Create Password</h4>
                <p>Your password must be a minimum of 6 characters long.</p>
                <div className="name">
                  Need help?
                  <a href="mailto:support@fikfis.uk">support@fikfis.uk</a>
                </div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <InputField
                    label="New Password"
                    placeholder="Enter new password"
                    type="password"
                    name="newPassword"
                    value={forgotPassword.newPassword}
                    onChange={handleChange}
                    required
                    validate={validatePasswordLength}
                    errorMessage="Password must be at least 6 characters long."
                  />
                  <InputField
                    label="Confirm Password"
                    placeholder="Confirm password"
                    type="password"
                    name="confirmPassword"
                    value={forgotPassword.confirmPassword}
                    onChange={handleChange}
                    required
                    validate={() =>
                      validatePasswordMatch(
                        forgotPassword.newPassword,
                        forgotPassword.confirmPassword
                      )
                    }
                    errorMessage="Passwords do not match."
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
