import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion/dist/framer-motion';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import './styles.scss';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        imgPath:
        'https://www.bigc.vn/img/application/sme/belve.png'
    },
    {
        imgPath:
        'https://www.bigc.vn/img/application/sme/hatdieurang.png'
    },
    {
        imgPath:
        'https://www.bigc.vn/img/application/sme/traxanhthainguyen.png'
    },
    {
        imgPath:
        'https://www.bigc.vn/img/application/sme/mamchinhtuy.png'
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

    const [amount, setAmount] = useState(1);
    return (
        <motion.div
            exit={{ opacity: 0 }}
            initial = {{ y: -60, opacity: 0 }}
            animate = {{ y: 0, opacity: 1 }}
            transition = {{ delay: .2 }}
            className="detail-page">
            <div className="detail-page__image">
                {/* <img src={image} alt="" /> */}
                <Box className='detail-page__list' sx={{ maxWidth: 500, flexGrow: 1 }}>
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
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            maxWidth: 500,
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
                                size="medium"
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
                            <Button size="medium" onClick={handleBack} disabled={activeStep === 0}>
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
                <div className="detail-page__cover">
                    <div className="detail-page__icon">
                        <button>
                            <ArrowBackIcon/>
                            <p>Trở về</p>
                        </button>
                    </div>
                    <h1>Name Product</h1>
                    <div className="detail-page__des">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas voluptatibus molestiae omnis dolorum saepe unde, commodi non, vel consectetur explicabo sapiente modi debitis dolores porro sint? Aliquam atque amet molestias.</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Soy Free</p>
                        <p>Gluten Free</p>
                    </div>
                    <div className="detail-page__price">
                        <div className="detail-page__quant">
                            <button className="detail-page__minus"
                                onClick={() => {if ( amount < 2) return; (setAmount(x => x - 1));} }
                            >
                                <RemoveIcon/>
                            </button>
                            <div className="detail-page__amount" >{amount}</div>
                            <button className="detail-page__add"
                                onClick={() => setAmount(x => x + 1)}
                            >
                                <AddIcon/>
                            </button>
                        </div>
                        <div className="detail-page__buy">$39.99</div>
                    </div>
                    <Button variant="contained" disableElevation>
                        Add to cart
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export default DetailProduct;