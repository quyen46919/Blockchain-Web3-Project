import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import MobileStepper from '@mui/material/MobileStepper';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { motion } from 'framer-motion/dist/framer-motion';
import { wrap } from 'popmotion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

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

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 200 : -200,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 200 : -200,
            opacity: 0
        };
    }
};

const swipeConfidenceThreshold = 1000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

function DetailProduct() {
    const theme = useTheme();
    const maxSteps = images.length;
    const [amount, setAmount] = useState(1);
    const [[page, direction], setPage] = useState([0, 0]);
    const imageIndex = wrap(0, images.length, page);

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <motion.div
            exit={{ opacity: 0 }}
            initial = {{ opacity: 0 }}
            animate = {{ opacity: 1 }}
            transition = {{ delay: .2 }}
            className="detail-page">
            <div className="detail-page__image">
                <Box className='detail-page__list' sx={{ maxWidth: 300, flexGrow: 1 }}>
                    <motion.img
                        key={page}
                        src={images[imageIndex].imgPath}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            // x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                    />
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={imageIndex}
                        sx={{
                            '& svg': {
                                color: green[600]
                            }
                        }}
                        nextButton={
                            <Button
                                size="medium"
                                onClick={() => paginate(1)}
                            >
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button
                                size="medium"
                                onClick={() => paginate(-1)}
                            >
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                ) : (
                                    <KeyboardArrowLeft />
                                )}
                            </Button>
                        }
                    />
                </Box>
                <div className="detail-page__position-image">
                    <Tabs value={imageIndex} sx={{ '& span.MuiTabs-indicator': { backgroundColor: green[600] } }}>
                        {
                            images.map((image, index) => (
                                <Tab
                                    label={<img src={image.imgPath} alt='img' className='active'/>}
                                    key={index}
                                    style={{ height: '100px' }}
                                    onClick={() => setPage([index, 0])}
                                />
                            ))
                        }
                    </Tabs>
                </div>
            </div>
            <div className="detail-page__content">
                <div className="detail-page__cover">
                    <div className="detail-page__icon">
                        <Button variant="outlined" startIcon={<ArrowBackIcon />}
                            sx={{
                                border: 'none!important',
                                textTransform: 'initial',
                                fontSize: 18,
                                color: green[600],
                                '& a': {
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }
                            }}
                        >
                            <Link to="/" exact="true">Trở về</Link>
                        </Button>
                    </div>
                    <h1>Tên sản phẩm</h1>
                    <div className="detail-page__des">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas voluptatibus molestiae omnis dolorum saepe unde, commodi non, vel consectetur explicabo sapiente modi debitis dolores porro sint? Aliquam atque amet molestias.</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Thực phẩm</p>
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
                        <div className="detail-page__buy">1.2 ethers</div>
                    </div>
                    <Button variant="contained" disableElevation
                        sx={{
                            backgroundColor: green[600],
                            textTransform: 'initial',
                            fontSize: 18,
                            '&:hover': {
                                backgroundColor: green[600]
                            }
                        }}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export default DetailProduct;