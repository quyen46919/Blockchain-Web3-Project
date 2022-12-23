import React from 'react';
import './styles.scss';
import { motion } from 'framer-motion/dist/framer-motion';
import noProduct from 'assets/images/noProduct.png';
import Button from '@mui/material/Button';
import Product from 'components/Product';
import { green } from '@mui/material/colors';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import getWeb3 from 'getWeb3';
import MyToken from 'contracts/MyToken.json';
import MyTokenSale from 'contracts/MyTokenSale.json';
import ItemManager from 'contracts/ItemManager.json';
import { Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useRef } from 'react';
import NotificationDialog from 'components/NotificationDialog';

function CartPage() {
    const { shoppingCart, dispatch } = useContext(AuthContext);
    const [totalPrice, setTotalPrice] = useState();
    const [tokenIns, setTokenInstance] = useState();
    const [account, setAccount] = useState('');
    const [userTokens, setUserToken] = useState(0);
    const tokenRef = useRef();
    const tokenSaleRef = useRef();
    const itemManagerRef = useRef();
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    const handleAcceptDialog = () => {
        history.go(0);
    };

    const initLoad = async () => {
        try {
            const { account, tokenInstance, tokenSaleInstance, itemManager } = await getWeb3();
            tokenRef.current = tokenInstance;
            tokenSaleRef.current = tokenSaleInstance;
            itemManagerRef.current = itemManager;
            setAccount(account);
        } catch (err) {
            handleShowDialog();
        }
    };

    useEffect(() => {
        initLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tokenRef.current) {
            getUserToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenRef.current, account]);

    useEffect(() => {
        let sum = 0;
        shoppingCart.forEach((item) => {
            sum += item.price;
        });
        setTotalPrice(sum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserToken = async () => {
        const tokenCount = await tokenRef.current.methods.balanceOf(account).call();
        if (tokenCount) {
            setUserToken(tokenCount);
        }
    };

    const handleBuyAllItems = async () => {
        try {
            if (itemManagerRef.current?.methods || tokenRef.current?.methods || tokenSaleRef.current?.methods) {
                const promises = shoppingCart.map(async (item) => {
                    await itemManagerRef.current.methods
                        .triggerPaymentWithToken(item.itemIndex)
                        .send({ from: account });
                    await tokenRef.current.methods.burn(account, totalPrice).send({ from: account });
                    await tokenSaleRef.current.methods.buyTokensPaypal(item.ownerId, item.price).send({ from: account });
                });
                await Promise.all(promises).then(async () => {
                    getUserToken();
                    setTotalPrice(0);
                    shoppingCart.forEach(async (item) => {
                        dispatch({ type: 'REMOVE_ITEM_IN_CART', payload: item?.id });
                        await axios.put(`${process.env.REACT_APP_SERVER_URL}/v1/items/${item?.id}`, { state: 1 });
                    });
                });
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('err', err);
            handleShowDialog();
        }
    };

    return (
        <>
            {shoppingCart.length === 0
                ? <motion.div
                    exit={{ opacity: 0 }}
                    initial = {{ y: -60, opacity: 0 }}
                    animate = {{ y: 0, opacity: 1 }}
                    transition = {{ delay: .2 }}
                    className="cart-page__empty">
                    <img src={noProduct} alt="" />
                    <Typography sx={{ color: green[600] }}>Hiện bạn chưa có sản phẩm nào trong giỏ hàng!</Typography>
                </motion.div>
                :<motion.div
                    exit={{ opacity: 0 }}
                    initial = {{ y: -60, opacity: 0 }}
                    animate = {{ y: 0, opacity: 1 }}
                    transition = {{ delay: .2 }}
                    className={ shoppingCart ? 'cart-page' : 'cart-page__empty'}>
                    <div className='cart-page__top'>
                        <h1>Giỏ Hàng</h1>
                        <div className='cart-page__content'>
                            <div className="cart-page__content">
                                <div className="cart-page__left">
                                    <h4>Bạn có {shoppingCart.length} sản phẩm trong giỏ hàng</h4>
                                    {
                                        shoppingCart.map((info, index) => (
                                            <Product info={info} key={index} />
                                        ))
                                    }
                                </div>
                                <div className="cart-page__right">
                                    <h4>Tổng</h4>
                                    <h1>{totalPrice} ECOMK Token</h1>
                                    <Button
                                        fullWidth
                                        sx={{
                                            textTransform: 'initial',
                                            height: '50px',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            borderRadius: 0,
                                            backgroundColor: `${green[600]}!important`,
                                            color: 'white'
                                        }}
                                        onClick={handleBuyAllItems}
                                    >
                                        Thanh Toán
                                    </Button>
                                    <Stack mt={2}>
                                        <Typography>Số dư hiện tại của bạn</Typography>
                                        <Typography>{userTokens} ECOMK</Typography>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showDialog && (
                        <NotificationDialog
                            showDialog={showDialog}
                            handleDialogClose={handleDialogClose}
                            handleAcceptDialog={handleAcceptDialog}
                        />
                    )}
                </motion.div>
            }
        </>

    );
}

export default CartPage;