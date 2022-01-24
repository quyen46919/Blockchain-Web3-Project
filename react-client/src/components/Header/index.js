import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Avatar, IconButton } from '@mui/material';
import avatar from 'assets/images/image8.jpg';
import img from 'assets/images/logo.png';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles.scss';

function Header() {
    return (
        <div className="header">
            <div className="header__logo">
                <div className="header__image">
                    <img src={img} alt="img logo"/>
                </div>
            </div>
            <div className="header__links">
                <NavLink to="/" exact>
                  Home page
                </NavLink>
                <NavLink to="/product" exact>
                  Product
                </NavLink>
                <NavLink to="/admin" exact>
                  Admin
                </NavLink>
            </div>
            <div className="header__user">
                <IconButton>
                    <ShoppingCartOutlinedIcon/>
                </IconButton>
                <IconButton>
                    <NotificationsNoneIcon/>
                </IconButton>
                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 30, height: 30 }}/>
            </div>
        </div>
    );
}

export default Header;