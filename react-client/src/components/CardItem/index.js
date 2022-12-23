import { Button } from '@mui/material';
import image from 'assets/images/image8.jpg';
import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import { green } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/formatDate';
import Web3 from 'web3';

CardItem.propTypes = {
    handleShowDetailPanel: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};

function CardItem(props) {
    const { handleShowDetailPanel, item } = props;
    return (
        <div className="card-item">
            <div className="card-item__img">
                <Link to={`/product/${item?.id}`} exact="true">
                    <img src={item?.images[0] || image} alt="item card image"/>
                </Link>
            </div>
            <div>
                <p className="card-item__title">
                    {item?.identify}
                </p>
                <span className="card-item__time">
                    Đăng tải vào {formatDate(item?.created_at)}
                </span>
            </div>
            <div className="card-item__line">
                <div className="card-item__prices">
                    <span>Giá (ECOMK)</span>
                    <p>{item?.price}</p>
                    {/* <p>{parseFloat(Web3.utils.fromWei(item?.price.toString(), 'ether')).toFixed(6)} ether</p> */}
                </div>
                <Button
                    variant="outlined"
                    onClick={() => handleShowDetailPanel(item)}
                    sx={{
                        textTransform: 'initial',
                        borderRadius: 3,
                        color: green[600],
                        borderColor: `${green[600]}!important`
                    }}
                > Xem mô tả </Button>
            </div>
        </div>
    );
}

export default CardItem;