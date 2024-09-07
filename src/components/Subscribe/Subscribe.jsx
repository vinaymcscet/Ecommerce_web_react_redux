import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './Subscribe.css';

const Subscribe = () => {
  return (
    <div className='subscribe'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={6} className="leftHead">
                <div className="subscribeMessage">
                  <h2>Subscribe to our emails</h2>
                  <p>Enter your email below to be the first to know about new collections and offers. </p>
                </div>
            </Grid>
            <Grid item xs={12} lg={6} md={6} className="rightSection">
                <div className="emailSection">
                  <input type="email" placeholder="Enter your email" />
                  <button type='button' className="emailBtn">SUBMIT</button>
                </div>
            </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Subscribe