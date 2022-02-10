import React from 'react';
import './styles.scss';
import { motion } from 'framer-motion/dist/framer-motion';
import image1 from 'assets/images/product_01.png';
import image2 from 'assets/images/product_02.png';
import image3 from 'assets/images/product_03.png';
import image4 from 'assets/images/product_04.png';
import noProduct from 'assets/images/noProduct.png';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Product from 'components/Product';
import { green } from '@mui/material/colors';


function CartPage() {
    const listCart = [
        {
            name: 'Dua muoi an ngon ghe Dua ',
            image: image1,
            price: '2',
            date: '02/03/2021'
        },
        {
            name: 'Ca phe sua chua duong',
            image: image2,
            price: '0.0002',
            date: '02/03/2022'
        },
        {
            name: 'Dua muoi an ngon ghe',
            image: image3,
            price: '0.00000000000000002',
            date: '02/03/2023'
        },
        {
            name: 'Dua muoi an ngon ghe',
            image: image4,
            price: '0.0000000000000000002',
            date: '02/03/2024'
        }
    ];
    return (
        <>
            {listCart.length === 0
                ? <motion.div
                    exit={{ opacity: 0 }}
                    initial = {{ y: -60, opacity: 0 }}
                    animate = {{ y: 0, opacity: 1 }}
                    transition = {{ delay: .2 }}
                    className="cart-page__empty">
                    <img src={noProduct} alt="" />
                    <h1>Hiện bạn chưa có sản phẩm nào trong giỏ hàng!</h1>
                </motion.div>
                :<motion.div
                    exit={{ opacity: 0 }}
                    initial = {{ y: -60, opacity: 0 }}
                    animate = {{ y: 0, opacity: 1 }}
                    transition = {{ delay: .2 }}
                    className={ listCart ? 'cart-page' : 'cart-page__empty'}>
                    <div className='cart-page__top'>
                        <h1>Giỏ Hàng</h1>
                        <div className='cart-page__content'>
                            <div className="cart-page__content">
                                <div className="cart-page__left">
                                    <h4>Bạn có {listCart.length} sản phẩm trong giỏ hàng</h4>
                                    {
                                        listCart.map((info, index) => (
                                            <Product info={info} key={index} />
                                        ))
                                    }
                                </div>
                                <div className="cart-page__right">
                                    <h4>Tổng</h4>
                                    <h1>$39.99</h1>
                                    <Button
                                        fullWidth
                                        sx={{
                                            textTransform: 'initial',
                                            height: '60px',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            borderRadius: 0,
                                            backgroundColor: `${green[600]}!important`,
                                            color: 'white'
                                        }}
                                    >
                            Thanh Toán
                                    </Button>
                                    <h5>Khuyến mãi</h5>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent:'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flex: 5,
                                            '& input':{
                                                flex: 4,
                                                height: '31px',
                                                border: '1px solid black',
                                                borderRadius: 0
                                            },
                                            '& button':{
                                                flex: 1,
                                                backgroundColor: `${green[600]}!important`,
                                                height: '35px',
                                                cursor: 'pointer'
                                            }
                                        }}>
                                        <input type="text" placeholder='Nhập mã giảm giá' />
                                        <Button
                                            sx={{
                                                textTransform: 'initial',
                                                fontWeight: '600',
                                                backgroundColor: 'green[600]!important',
                                                borderRadius: 0,
                                                color: 'white'
                                            }}
                                        >Áp dụng</Button>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            }
        </>

    );
}

export default CartPage;