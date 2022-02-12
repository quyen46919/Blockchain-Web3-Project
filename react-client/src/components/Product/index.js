import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

Product.propTypes = {
    info: PropTypes.object.isRequired
};


function Product(props) {
    const { info } = props;
    const { image, name, price, date } = info;
    return (
        <div className="cart-item-page__item">
            <div className="cart-item-page__image">
                <img src={image} alt="" />
            </div>
            <div className="cart-item-page__title">
                <h5>{name}</h5>
                <h3>Giá: {price} ethers</h3>
                <p>By Hoang Huu Tai, em dep lam! </p>
                <div className="cart-item-page__date">
                    <p>Ngày tải lên: {date}</p>
                </div>
                <p>57 hours*em cung dep lam</p>
                <Box
                    sx={{
                        '& h3':{
                            fontWeight: '600',
                            fontSize: 14,
                            margin: 0
                        }
                    }}
                    className="cart-item-page__price">
                </Box>
            </div>
            <Box
                className='cart-item-page__link'
                sx={{
                    width: '130px',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'column',
                    '& button':{
                        display: 'flex',
                        justifyContent:'flex-end',
                        padding: 0,
                        height: 'auto',
                        fontWeight: '500',
                        margin: 0
                    },
                    '& button:hover':{
                        background: 'transparent'
                    }
                }}
            >
                <Button>Xóa</Button>
                <Button>Lưu lại</Button>
                <Button>Yêu thích</Button>
            </Box>
        </div>
    );
}

export default Product;