/* eslint-disable react-hooks/exhaustive-deps */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { green, grey } from '@mui/material/colors';
import MobileStepper from '@mui/material/MobileStepper';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import { motion } from 'framer-motion/dist/framer-motion';
import { useSnackbar } from 'notistack';
import { wrap } from 'popmotion';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { convertState } from 'utils/convertState';
import './styles.scss';

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
    const [[page, direction], setPage] = useState([0, 0]);
    const [imageIndex, setImageIndex] = useState(wrap(0, 0, page));
    const [maxSteps, setMaxSteps] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    // var maxSteps = images.length;
    // var imageIndex = wrap(0, images.length, page);
    let { productId } = useParams();
    const [item, setItem] = useState();
    const { dispatch, shoppingCart } = useContext(AuthContext);

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
        setImageIndex(wrap(0, item?.images.length, page + newDirection));
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/items/${productId}`);
                setItem(res.data);
                setMaxSteps(res.data.images.length);
                setImageIndex(wrap(0, res.data.images.length, page));
            } catch (err) {
                enqueueSnackbar('Có lỗi xảy ra, vui lòng f5 và thử lại!', {
                    variant: 'error'
                });
            }
        };
        fetchItem();
    }, []);

    const handleAddItemToCart = async () => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    return (
        <motion.div
            exit={{ opacity: 0 }}
            initial = {{ opacity: 0 }}
            animate = {{ opacity: 1 }}
            transition = {{ delay: .2 }}
            className="detail-page">
            <div className="detail-page__image">
                <Box className='detail-page__list' sx={{ maxWidth: '80%', flexGrow: 1 }}>
                    <motion.img
                        key={page}
                        src={item?.images[imageIndex]}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
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
                            item?.images.map((image, index) => (
                                <Tab
                                    label={<img src={image} alt='img'/>}
                                    key={index}
                                    sx={{
                                        '& img': {
                                            height: 50,
                                            width: 100
                                        }
                                    }}
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
                    <Typography
                        sx={{
                            fontSize: 32,
                            fontWeight: 500,
                            color: grey[800],
                            mb: 2
                        }}
                    >
                        {item?.identify}
                    </Typography>
                    {/* <div className="detail-page__des">
                        <p>Mô tả sản phẩm: {item?.description}</p>
                    </div> */}
                    <div className="detail-page__footer">
                        <p>Mô tả sản phẩm: {item?.description}</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Danh mục: {item?.category}</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Ngày đăng: {item?.created_at}</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Địa chỉ người bán: {item?.ownerId}</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Địa chỉ sản phẩm: {item?.itemAddress}</p>
                    </div>
                    <div className="detail-page__footer">
                        <p>Trạng thái: {convertState(item?.state)}</p>
                    </div>
                    <div className="detail-page__price">
                        {/* <div className="detail-page__quant">
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
                        </div> */}
                        <Typography
                            sx={{
                                color: green[600],
                                fontWeight: 600
                            }}
                        >
                            Giá: {item?.price} ECOMK
                        </Typography>
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
                        onClick={handleAddItemToCart}
                        disabled={shoppingCart.find((itemInCart) => itemInCart.id === item?.id) ? true : false}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export default DetailProduct;