import { Button } from '@mui/material';
import image from 'assets/images/image8.jpg';
import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

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
            <p className="card-item__title">item name </p>
            <div className="card-item__line">
                <div className="card-item__prices">
                    <p>Price</p>
                    <span>0.2 ether</span>
                </div>
                <Button variant="outlined" onClick={handleShowDetailPanel}>
                    Show detail
                </Button>
            </div>
        </div>
    );
}

export default CardItem;