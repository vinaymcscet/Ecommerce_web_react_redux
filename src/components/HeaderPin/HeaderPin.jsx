import './HeaderPin.css';
import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import QuoteSlider from '../QuoteSlider/QuoteSlider';
import { SliderData } from '../../utils/QuoteSliderData';

const HeaderPin = () => {
    return (
        <div className='headerPinContainer'>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <img src="/images/free-shipping.png" alt='Free Shipping' />
                    </Grid>
                    <Grid item xs={6}>
                        <div className="frame">
                            <QuoteSlider slides={SliderData} />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="getApp">
                            <img src="/images/get-app.png" alt='Get Fiki App' />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default HeaderPin;