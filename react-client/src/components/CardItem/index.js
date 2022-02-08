import { Button } from '@mui/material';
import image from 'assets/images/image8.jpg';
import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import { green } from '@mui/material/colors';

CardItem.propTypes = {
    handleShowDetailPanel: PropTypes.func.isRequired
};

function CardItem(props) {
    const { handleShowDetailPanel } = props;
    return (
        <div className="card-item">
            <div className="card-item__img">
                <img src={image} alt="item card image"/>
            </div>
            <div>
                <p className="card-item__title">
                    Sản phẩm đồ gia dụng thông minh Sản phẩm đồ gia dụng thông minh Sản phẩm đồ gia dụng thông minh
                </p>
                <span className="card-item__time">
                    Đăng tải vào 1 giờ trước
                </span>
            </div>
            <div className="card-item__line">
                <div className="card-item__prices">
                    <span>Giá</span>
                    <p>0.2 ether</p>
                </div>
                <Button
                    variant="outlined"
                    onClick={handleShowDetailPanel}
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