import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import avatar from 'assets/images/image8.jpg';
import img from 'assets/images/new-logo.jpg';
import imgTitle from 'assets/images/logo-title.jpg';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles.scss';
import { grey } from '@mui/material/colors';

function Header() {
    return (
        <div className="header">
            <div className="header__logo">
                <div className="header__image">
                    <img src={img} alt="img logo"/>
                    <img src={imgTitle} alt="img logo title"/>
                </div>
            </div>
            <div className="header__links">
                <NavLink to="/" exact>
                  Trang chủ
                </NavLink>
                <NavLink to="/product" exact>
                  Sản phẩm
                </NavLink>
                <NavLink to="/admin" exact>
                  Quản lí sản phẩm
                </NavLink>
            </div>
            <div className="header__user">
                <Tooltip title="Giỏ hàng">
                    <Link
                        to="/cart"
                    ><IconButton>
                            <ShoppingCartOutlinedIcon sx={{ color: grey[500] }} to={'/cart'}/>
                        </IconButton></Link>
                </Tooltip>
                <Tooltip title="Thông báo">
                    <IconButton>
                        <NotificationsNoneIcon sx={{ color: grey[500] }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cài đặt">
                    <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 30, height: 30 }} className="header__user--avatar"/>
                </Tooltip>
            </div>
        </div>
    );
}

export default Header;