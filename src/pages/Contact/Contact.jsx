import React, { useState } from "react";
import "./Contact.css";
import Button from "../../components/Button/Button";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    // Subject validation
    if (!formData.subject.trim()) {
      formErrors.subject = "Subject is required";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      formErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = "Phone number is invalid, should be 10 digits";
    }

    // Message validation
    if (!formData.message.trim()) {
      formErrors.message = "Message is required";
    }

    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Process the form data (e.g., submit to server)
      console.log("Form submitted:", formData);
    }
  };
  return (
    <div className="contact">
      <h4>Contact</h4>
      <div className="leaveMessage">
        <h6>Leave A Message</h6>
      </div>
      <p className="leaveText">
        {" "}
        If You Have Any Questions Please Send Us A Message Using The Adjacent
        Form And We Will Get Back To You As Soon As Possible
      </p>
      <div className="contactMessage">
        <h6>
          Email: <a href="mailto:abc@xyz.com">abc@xyz.com</a>
        </h6>
        <h6>
          Customer Care Number: <a href="tel:0000-0000-0000">0000-0000-0000</a>
        </h6>
      </div>
      <div className="contactForm">
        <form onSubmit={handleSubmit}>
          <div className="box">
            <div className="form-control">
              <label htmlFor="fullName">Full Name*</label>
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
              <label htmlFor="email">Email*</label>
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
              <label htmlFor="subject">Subject*</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter Subject"
                value={formData.subject}
                onChange={handleChange}
              />
              {errors.subject && <p className="error">{errors.subject}</p>}
            </div>
            <div className="form-control">
              <label htmlFor="phone">Mobile or Phone Number*</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
          </div>

          <div className="box full">
            <div className="form-control">
              <label htmlFor="message">Write Your Message</label>
              <textarea
                name="message"
                placeholder="Write Your Message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {errors.message && <p className="error">{errors.message}</p>}
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
      <div className="contactLocation">
        <img src="/images/map.svg" alt="Contact Location" />
      </div>
    </div>
  );
};

export default Contact;
