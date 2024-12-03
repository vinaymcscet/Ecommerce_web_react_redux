import './HeaderPin.css';
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import QuoteSlider from '../QuoteSlider/QuoteSlider';
// import { SliderData } from '../../utils/QuoteSliderData';
import { useDispatch, useSelector } from 'react-redux';
import { getCMSGroupItemRequest } from '../../store/slice/api_integration';

const HeaderPin = () => {
    const dispatch = useDispatch();
    const { cmsGroupItem } = useSelector((state) => state.cms);
    useEffect(() => {
        const responseObj = { group_key: 'notice'};
        dispatch(getCMSGroupItemRequest(responseObj));
    }, [])
    const sliderData = [
        cmsGroupItem?.title_1, 
        cmsGroupItem?.title_1, 
        cmsGroupItem?.title_1, 
        cmsGroupItem?.title_1,
        cmsGroupItem?.title_1
    ];
    return (
        <div className='headerPinContainer'>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xl={3} sm={3} xs={5}>
                        <div className='freeItems'>
                            <img src="/images/Truck.svg" alt='Free Shipping' />
                            <p>Free Shipping</p>
                        </div>
                    </Grid>
                    <Grid item xl={6} sm={6} xs={0}>
                        <div className="frame">
                            <QuoteSlider slides={sliderData} />
                        </div>
                    </Grid>
                    <Grid item xl={3} sm={3} xs={6}>
                        <div className="getApp">
                            <img src="/images/Smartphone.svg" alt='Free Shipping' />
                            <p>Get the FikFis App</p>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default HeaderPin;