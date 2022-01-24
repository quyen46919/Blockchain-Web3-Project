import React, { Component } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './styles.scss';
import image from 'assets/images/image8.jpg';


class detailProduct extends Component {
    render() {
        return (
            <div className="homepage">
                <div className="homepage--image">
                    <img src={image} alt="" />
                </div>
                <div className="homepage--content">
                    <div className="homepage--icon">
                        <ArrowBackIcon/>
                        <p>Trở về</p>
                    </div>
                    <h1>Name Product</h1>
                    <div className="homepage--rating">
                        <Stack spacing={1}>
                            <Rating name="half-rating" defaultValue={2} precision={0.5} />
                        </Stack>
                        <p>(Reviewer)</p>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas voluptatibus molestiae omnis dolorum saepe unde, commodi non, vel consectetur explicabo sapiente modi debitis dolores porro sint? Aliquam atque amet molestias.</p>
                </div>
            </div>
        );
    }
}

export default detailProduct;