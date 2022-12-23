import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import getWeb3 from 'getWeb3';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import './styles.scss';

Product.propTypes = {
    info: PropTypes.object.isRequired
};

function Product(props) {
    const { info } = props;
    const { images, identify, price, description, created_at, category, id, itemAddress } = info;
    const { dispatch, metamaskAddress } = useContext(AuthContext);
    const [web3Instance, setWeb3Instance] = useState();
    const { enqueueSnackbar } = useSnackbar();

    const handleRemoveItem = () => {
        dispatch({ type: 'REMOVE_ITEM_IN_CART', payload: id });
    };

    const onInit = async () => {
        try {
            const web3 = await getWeb3();
            setWeb3Instance(web3);
        } catch (error) {
            enqueueSnackbar('Không tìm thấy web3 trong trình duyệt, vui lòng F5 và thử lại!', {
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBuyItem = async () => {
        try {
            const params = {
                from: metamaskAddress,
                to: itemAddress,
                value: price
            };
            // console.log('params = ', params);

            await web3Instance.eth.sendTransaction(params);
            // console.log('send transaction successfully!');
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/v1/items/${id}`, { state: 1 });

            enqueueSnackbar('Thanh toán thành công', {
                variant: 'success'
            });
            dispatch({ type: 'REMOVE_ITEM_IN_CART', payload: id });
        } catch (err) {
            enqueueSnackbar('Thanh toán thất bại, vui lòng thử lại sau', {
                variant: 'error'
            });
        }
    };

    return (
        <div className="cart-item-page__item">
            <div className="cart-item-page__image">
                <img src={images[0]} alt="" />
            </div>
            <div className="cart-item-page__title">
                <h5>{identify}</h5>
                <h3>Giá: {price} ECOMK</h3>
                <p>Mô tả: {description}</p>
                <div className="cart-item-page__date">
                    <p>Ngày tải lên: {created_at}</p>
                </div>
                <p>Danh mục: {category}</p>
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
                <Button onClick={handleRemoveItem}>Xóa</Button>
                {/* <Button onClick={handleBuyItem}>Mua hàng</Button> */}
            </Box>
        </div>
    );
}

export default Product;