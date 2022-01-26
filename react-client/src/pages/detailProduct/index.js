import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import './styles.scss';
import image from 'assets/images/image8.jpg';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        imgPath:
        'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
    },
    {
        imgPath:
        'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
    },
    {
        imgPath:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
        imgPath:
        'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60'
    }
];


function DetailProduct() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };
    return (
        <div className="detail-page">
            <div className="detail-page__image">
                {/* <img src={image} alt="" /> */}
                <Box className='detail-page__list' sx={{ maxWidth: 800, flexGrow: 1 }}>
                    <AutoPlaySwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {images.map((step, index) => (
                            <div key={step.label}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <Box
                                        component="img"
                                        sx={{
                                            display: 'block',
                                            maxWidth: 800,
                                            // overflow: 'hidden',
                                            width: '100%'
                                        }}
                                        src={step.imgPath}
                                        alt={step.label}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                ) : (
                                    <KeyboardArrowLeft />
                                )}
                            </Button>
                        }
                    />
                </Box>
            </div>
            <div className="detail-page__content">
                <div className="detail-page__icon">
                    <ArrowBackIcon/>
                    <p>Trở về</p>
                </div>
                <h1>Name Product</h1>
                <div className="detail-page__rating">
                    <Stack spacing={1}>
                        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                    </Stack>
                    <p>(Reviewer)</p>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas voluptatibus molestiae omnis dolorum saepe unde, commodi non, vel consectetur explicabo sapiente modi debitis dolores porro sint? Aliquam atque amet molestias.</p>
            </div>
            <div className="detail-page__bottom">
                <div className="detail-page__left">
                    <img src={image} alt="" />
                    <div className="detail-page__title">
                        <h2>Product Name</h2>
                        <p>Lorem ipsum dolor sit amet consectetur </p>
                    </div>
                </div>
                <div className="detail-page__right">
                    <h2>$325</h2>
                    <Button variant="outlined" >add to cart
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DetailProduct;