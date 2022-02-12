import { Logout, Person, Settings } from '@mui/icons-material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Avatar, Badge, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import imgTitle from 'assets/images/logo-title.jpg';
import img from 'assets/images/new-logo.jpg';
import { AuthContext } from 'context/AuthContext';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles.scss';

function Header() {
    const { user, dispatch, shoppingCart } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

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
                {
                    user && <>
                        <NavLink to="/admin" exact>
                        Quản lí sản phẩm
                        </NavLink>
                        <NavLink to="/post" exact>
                    Đăng sản phẩm
                        </NavLink>
                    </>
                }
            </div>
            <div className="header__user">
                {
                    user
                        ? <>
                            <Tooltip title="Giỏ hàng">
                                <Link exact="true" to="/cart">
                                    <IconButton>
                                        <Badge badgeContent={shoppingCart.length}
                                            sx={{
                                                '& span': {
                                                    backgroundColor: green[600],
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            <ShoppingCartOutlinedIcon sx={{ color: grey[500] }}/>
                                        </Badge>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                            <Tooltip title="Thông báo">
                                <IconButton>
                                    <NotificationsNoneIcon sx={{ color: grey[500] }}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cài đặt">
                                <Avatar
                                    alt="Remy Sharp"
                                    src={user.user.avatar}
                                    sx={{ width: 30, height: 30 }}
                                    className="header__user--avatar"
                                    onClick={handleClick}
                                />
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0
                                        }
                                    }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                sx={{
                                    '& p': { fontSize: 15 },
                                    '& a': { textDecoration: 'none', color: 'inherit' }
                                }}
                            >
                                <MenuItem sx={{ minWidth: 200 }}>
                                    <ListItemIcon>
                                        <Person fontSize="small"/>
                                    </ListItemIcon>
                                    <Typography>Tài khoản</Typography>
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    <Typography>Cài đặt</Typography>
                                </MenuItem>
                                <Link exact="true" to="/account" onClick={handleLogout}>
                                    <MenuItem >
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        <Typography>Đăng xuất</Typography>
                                    </MenuItem>
                                </Link>
                            </Menu>
                        </>
                        : <>
                            <Button variant="outlined" color="success"
                                sx={{ textTransform: 'initial', '& a': { textDecoration: 'none', color: 'inherit' } }}
                            >
                                <Link exact="true" to="/account">
                                    Đi tới đăng nhập
                                </Link>
                            </Button>
                        </>
                }

            </div>
        </div>
    );
}

export default Header;