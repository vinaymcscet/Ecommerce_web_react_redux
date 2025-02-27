import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Contact.css";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { getCMSContactUsRequest } from "../../store/slice/api_integration";

const Contact = () => {
  const { cmsSocialLinks } = useSelector(state => state.cms);
  const dispatch = useDispatch();

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
      const responseObj = {
        type: 'support/contact',
        name : formData.fullName,
        email : formData.email,
        mobile :  formData.phone,
        subject :  formData.subject,
        description : formData.message,
      };
      dispatch(getCMSContactUsRequest(responseObj)).finally(() => {
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          phone: "",
          message: "",
        })
      });
    }
  };
  const currentUrl = window.location.href;
  const baseUrl = window.origin;
  return (
    <div className="contact">
      {/* SEO Meta Tags */}
      <Helmet>
          <title>{'Contact Us | Get in Touch with FikFis'}</title>
          <meta name="description" content={"Have questions or need assistance? Contact FikFis today! Reach out to our team for support, inquiries, or feedback—we're here to help."} />
          <meta name="keywords" content={'Contact Us | Get in Touch with FikFis'} />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:title" content={'Contact Us | Get in Touch with FikFis'} />
          <meta property="og:description" content={"Have questions or need assistance? Contact FikFis today! Reach out to our team for support, inquiries, or feedback—we're here to help."} />
          <meta property="og:image" content={`${baseUrl}/images/icons/LOGO1.png`} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="article" />
          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content="article" />
          <meta property="twitter:url" content={currentUrl} />
          <meta property="twitter:title" content={'Contact Us | Get in Touch with FikFis'} />
          <meta property="twitter:description" content={"Have questions or need assistance? Contact FikFis today! Reach out to our team for support, inquiries, or feedback—we're here to help."} />
          <meta property="twitter:image" content={`${baseUrl}/images/icons/LOGO1.png`} />
      </Helmet>
      <h4>Contact</h4>
      <div className="leaveMessage">
        <h6>Leave A Message</h6>
      </div>
      <p className="leaveText">
        If You Have Any Questions Please Send Us A Message Using The Adjacent
        Form And We Will Get Back To You As Soon As Possible
      </p>
      <div className="contactMessage">
        <h6>
          Email: <a href={`mailto:${cmsSocialLinks?.email_support}`}>{cmsSocialLinks?.email_support}</a>
        </h6>
        <h6>
          Customer Care Number: <a href={`tel:${cmsSocialLinks?.mobile_fikfis}`}>{cmsSocialLinks?.mobile_fikfis}</a>
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
        {/* <img src="/images/map.svg" alt="Contact Location" /> */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2336141435003!2d-0.09139782337872945!3d51.527274871817795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ca671d5df0b%3A0x368e18d29207f698!2s128%20City%20Rd%2C%20London%20EC1V%202NX%2C%20UK!5e0!3m2!1sen!2sin!4v1733487116804!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{"border":0}} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
