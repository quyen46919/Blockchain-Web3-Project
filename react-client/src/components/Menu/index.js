import { BookmarkBorderOutlined, ChatBubbleOutline, ForumOutlined, LogoutOutlined, PeopleAltOutlined, PhoneInTalkOutlined } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import defaultAvatar from 'assets/images/noAvatar.png';
import { AuthContext } from 'context/AuthContext';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.scss';

function Menu() {
    const { user, dispatch } = useContext(AuthContext);

    const handleLogOut = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <div className="menu">
            <div className="menu__group">
                <Tooltip title="Trò chuyện cá nhân" placement="right">
                    <NavLink to="/" exact>
                        <ChatBubbleOutline/>
                    </NavLink>
                </Tooltip>
                <Tooltip title="Trò chuyện nhóm" placement="right">
                    <NavLink to="/group" exact>
                        <ForumOutlined/>
                    </NavLink>
                </Tooltip>
                <Tooltip title="Bạn bè" placement="right">
                    <NavLink to="/friends" exact>
                        <PeopleAltOutlined/>
                    </NavLink>
                </Tooltip>
                <Tooltip title="Gọi điện thoại" placement="right">
                    <NavLink to="/call" exact>
                        <PhoneInTalkOutlined/>
                    </NavLink>
                </Tooltip>
                <Tooltip title="Tin nhắn đã đánh dấu" placement="right">
                    <NavLink to="/book-mark" exact>
                        <BookmarkBorderOutlined/>
                    </NavLink>
                </Tooltip>
            </div>
            <div className="menu__group menu__group--last">
                <Tooltip title="Tài khoản" placement="right">
                    <NavLink to="/profile" exact>
                        <Avatar alt="avatar user" src={user?.profilePicture || defaultAvatar} sx={{ width: 30, height: 30 }} />
                    </NavLink>
                </Tooltip>
                <Tooltip title="Đăng xuất" placement="right">
                    <NavLink to="/account" exact onClick={handleLogOut}>
                        <LogoutOutlined/>
                    </NavLink>
                </Tooltip>
            </div>
        </div>
    );
}

export default Menu;