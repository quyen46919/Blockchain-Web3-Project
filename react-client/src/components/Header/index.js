import React from 'react';
// import img from 'assets/images/logo.png';
import avatar from 'assets/images/image8.jpg';
import { NavLink } from 'react-router-dom';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import './styles.scss';
import { Avatar, IconButton } from '@mui/material';

function Header() {
    return (
        <div className="header">
            <div className="header__logo">
                {/* <img src={img} alt="img logo"/> */}
                IMG Ở ĐÂY
            </div>
            <div className="header__links">
                <NavLink to="/" exact>
                  Home page
                </NavLink>
                <NavLink to="/workshop" exact>
                  Workshop
                </NavLink>
                <NavLink to="/care" exact>
                  Care
                </NavLink>
            </div>
            <div className="header__user">
                <IconButton>
                    <AccessAlarmIcon/>
                </IconButton>
                <IconButton>
                    <AddPhotoAlternateOutlinedIcon/>
                </IconButton>
                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 30, height: 30 }}/>
            </div>
        </div>
    );
}

export default Header;