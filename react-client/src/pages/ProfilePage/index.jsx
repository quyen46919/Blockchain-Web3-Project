
import { Email, EventAvailable, LocationOn, Phone, Wc } from '@mui/icons-material';
import defaultAvatar from 'assets/images/noAvatar.png';
import { AuthContext } from 'context/AuthContext';
import React, { useContext } from 'react';
import CustomTabs from './CustomTabs';
import './styles.scss';

function ProfilePage() {
    // LẤY THÔNG TIN USER TỪ AUTHCONTEXT
    const { user } = useContext(AuthContext);

    return (
        <div className="profile">
            <div className="profile__info">
                <div className="profile__avatar">
                    <div
                        className="profile__avatar--img"
                        style={{ backgroundImage: `url("${user?.profilePicture || defaultAvatar}")` }}
                    />
                </div>
                <div className="profile__name">
                    <h3>{user?.username}</h3>
                </div>
                <div className="profile__details">
                    <div className="profile__line">
                        <div className="profile__icon">
                            <LocationOn/>
                        </div>
                        <div className="profile__des">
                            <h4>Địa chỉ</h4>
                            <p>{user?.address || 'Bạn chưa cập nhật địa chỉ'}</p>
                        </div>
                    </div>
                    <div className="profile__line">
                        <div className="profile__icon">
                            <Phone/>
                        </div>
                        <div className="profile__des">
                            <h4>Số điện thoại</h4>
                            <p>{user?.phone || 'Bạn chưa cập nhật số điện thoại'}</p>
                        </div>
                    </div>
                    <div className="profile__line">
                        <div className="profile__icon">
                            <Email/>
                        </div>
                        <div className="profile__des">
                            <h4>Email</h4>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="profile__line">
                        <div className="profile__icon">
                            <Wc/>
                        </div>
                        <div className="profile__des">
                            <h4>Giới tính</h4>
                            <p>{user?.gender || 'Bạn chưa cập nhật giới tính'}</p>
                        </div>
                    </div>
                    <div className="profile__line">
                        <div className="profile__icon">
                            <EventAvailable/>
                        </div>
                        <div className="profile__des">
                            <h4>Tuổi</h4>
                            <p>{user?.age || 'Bạn chưa cập nhật tuổi'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile__analysist">
                <CustomTabs/>
            </div>

        </div>
    );
}

export default ProfilePage;