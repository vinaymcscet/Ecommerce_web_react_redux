import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './Copyright.css';

const Copyright = () => {
  return (
    <div className='copyright'>
      <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} lg={3} className="leftHead">
              <p>@2024 - All Right reserved!</p>
            </Grid>
            <Grid item xs={12} md={9} lg={9} className="rightCopyright">
              <img src="/images/icons/support-card.svg" alt="Cards" />
            </Grid>
          </Grid>
        </Box>
    </div>
  )
}

export default Copyright