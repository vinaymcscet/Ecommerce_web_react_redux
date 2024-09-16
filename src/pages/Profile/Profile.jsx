import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import { setUser } from "../../store/slice/userSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { image, email, name, phone, password } = user?.[0] || {};

  useEffect(() => {
    if (user && user[0]) {
      console.log(user[0]);
      console.log(image, email, name);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: name || "",
    email: email || "",
    phone: phone || "",
    password: password || "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
  });

  useEffect(() => {
    if (user && user[0]) {
      setFormData({
        fullName: name || "",
        email: email || "",
        phone: phone || "",
        password: password || "",
      });
    }
  }, [user, name, email, phone, password]);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = (field) => {
    const updatedErrors = validateField(field);
    if (Object.keys(updatedErrors).length === 0) {
      setIsEditing({ ...isEditing, [field]: false });
    } else {
      setErrors({ ...errors, ...updatedErrors });
    }
  };

  const handleCancelClick = (field) => {
    setFormData({
      fullName: name,
      email: email,
      phone: phone,
      password: password,
    });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const validateField = (field) => {
    const newErrors = {};
    if (field === "email" && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (field === "phone" && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (field === "password" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (field === "fullName" && formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
    }
    return newErrors;
  };
  console.log(formData);
  const validateInputs = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
    }

    // Validate email format
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Ensure phone number is exactly 10 digits
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be a valid 10-digit number.";
    }

    // Ensure password is at least 6 characters long
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    return newErrors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      // Dispatch the action to update the Redux user state
      dispatch(setUser(formData));
      alert("Profile updated successfully!");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="userProfile">
      <h1>Your Profile</h1>
      <div className="vertical-tabs-container">
        <div className="tabs">
          <div className="profile_user_image">
            <img src={image} alt={name} />
          </div>
          <p>Categories</p>
          <div className="email">{email}</div>
          <div
            className={`tab ${activeTab === 0 ? "active" : ""}`}
            onClick={() => setActiveTab(0)}
          >
            <img src="/images/profile/user1.svg" alt="Login" />
            <span>Login and Security</span>
          </div>
          <div
            className={`tab ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
          >
            <img src="/images/profile/orders.svg" alt="Login" />
            <span>Your Orders</span>
          </div>
          <div
            className={`tab ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            <img src="/images/profile/address.svg" alt="Login" />
            <span>Your Address</span>
          </div>
          <div
            className={`tab ${activeTab === 3 ? "active" : ""}`}
            onClick={() => setActiveTab(3)}
          >
            <img src="/images/profile/reviews.svg" alt="Login" />
            <span>Your Reviews</span>
          </div>
          <div
            className={`tab ${activeTab === 4 ? "active" : ""}`}
            onClick={() => setActiveTab(4)}
          >
            <img src="/images/profile/coupen.svg" alt="Login" />
            <span>Coupons & offers</span>
          </div>
          <div
            className={`tab ${activeTab === 5 ? "active" : ""}`}
            onClick={() => setActiveTab(5)}
          >
            <img src="/images/profile/whistlist.svg" alt="Login" />
            <span>Your Wishlist</span>
          </div>
        </div>
        <div className="tab-content">
          {activeTab === 0 && (
            <div className="login_security">
              <h3>Login and Security</h3>
              <div className="login_securityWrapper">
                <form onSubmit={handleSubmit}>
                  <div className="box">
                    <div className="form-control">
                      <label for="fullName">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing.fullName}
                      />
                      {errors.fullName && (
                        <span className="error">{errors.fullName}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.fullName ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("fullName")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("fullName")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("fullName")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing.email}
                      />
                      {errors.email && (
                        <span className="error">{errors.email}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.email ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("email")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("email")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("email")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="Mobile or Phone Number">
                        Mobile or Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Mobile or Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing.phone}
                      />
                      {errors.phone && (
                        <span className="error">{errors.phone}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.phone ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("phone")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("phone")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("phone")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box">
                    <div className="form-control">
                      <label for="password">Password</label>
                      <input
                        type={!isEditing.password ? "password" : "text"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={!isEditing.password}
                      />
                      {errors.password && (
                        <span className="error">{errors.password}</span>
                      )}
                    </div>
                    <div className="editableAction">
                      {!isEditing.password ? (
                        <div
                          className="edit"
                          onClick={() => handleEditClick("password")}
                        >
                          <img src="/images/profile/edit.svg" alt="edit" />
                        </div>
                      ) : (
                        <div className="saveMode">
                          <div
                            className="save"
                            onClick={() => handleSaveClick("password")}
                          >
                            <img src="/images/profile/tick.svg" alt="Save" />
                          </div>
                          <div
                            className="cancel"
                            onClick={() => handleCancelClick("password")}
                          >
                            <img src="/images/profile/cross.svg" alt="cancel" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type={"submit"}
                    value={"save changes"}
                    varient="explore contact"
                    space="sp-10"
                  />
                </form>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h3>Content for Tab 2</h3>
              <p>This is the content of the second tab.</p>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <h3>Content for Tab 3</h3>
              <p>This is the content of the third tab.</p>
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <h3>Content for Tab 4</h3>
              <p>This is the content of the first tab.</p>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <h3>Content for Tab 5</h3>
              <p>This is the content of the second tab.</p>
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <h3>Content for Tab 6</h3>
              <p>This is the content of the third tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
