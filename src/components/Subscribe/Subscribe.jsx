import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { subscribeNewsLetter } from '../../store/slice/api_integration';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { setClearNewsletterMessage } from '../../store/slice/userSlice';
import './Subscribe.css';

const Subscribe = () => {
  const [newsLetter, setNewsLetter] = useState({ email: ''});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { newsletter } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleNewsLetter = (e) => {
    const { name, value } = e.target;
    setNewsLetter({
      ...newsLetter,
      [name]: value
    })
  }
  
  const validate = () => {
    let formErrors = {};

    // Email validation
    if (!newsLetter.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newsLetter.email)) {
      formErrors.email = "Email address is invalid";
    }
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false)
    } else {
        setErrors({});
        // Process the form data (e.g., submit to server)
        const responseObj = {
          email : newsLetter.email,
        };
        dispatch(subscribeNewsLetter(responseObj))
        // .then(() => setLoading(true))
        .finally(() => {
          setLoading(false);
          setNewsLetter({ email: ''})
        });
    }
  }
  useEffect(() => {
    if (newsletter) {
      const timer = setTimeout(() => {
        dispatch(setClearNewsletterMessage()); // Assuming `clearNewsletterMessage` clears the `newsletter` in Redux
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [newsletter, dispatch]);

  return (
    <div className='subscribe'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={12} className="leftHead">
                <div className="subscribeMessage">
                  <h2>Subscribe to our emails</h2>
                  <p>Enter your email below to be the first to know about new collections and offers. </p>
                </div>
            </Grid>
            <Grid item xs={12} lg={6} md={12} className="rightSection">
                <div className="emailSection">
                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter your email" name="email" value={newsLetter.email} onChange={handleNewsLetter} />
                    <button type='submit' className="emailBtn">SUBMIT</button>
                  </form>
                </div>
                {errors.email && <p className="error">{errors.email}</p>}
                {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
              <p className='newsletterMessage'>{newsletter}</p>
            )}
            </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Subscribe