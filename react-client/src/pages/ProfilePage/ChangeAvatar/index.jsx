import { Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import './styles.scss';

function ChangeAvatar() {
    const [images, setImages] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [uploadimage, setUploadImage] = useState();
    const { user, dispatch } = useContext(AuthContext);
    const [isUpdating, setIsUpdating] = useState(false);

    // Gọi API upload ảnh lên Cloudinary
    const onSubmit = async () => {
        // HIỂN THỊ THANH LOADING
        setIsUpdating(true);
        // KHỞI TẠO FORMDATA ĐỂ UPLOAD ẢNH
        const formData = new FormData();
        formData.append('file', uploadimage);
        formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

        axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_DOC_NAME}/image/upload`, formData)
            .then(res => {
                // KHI ĐÃ CÓ ẢNH TRẢ VỀ THÌ THỰC HIỆN GỌI API ĐỂ CẬP NHẬT THÔNG TIN USER
                let submitValue = {
                    ...user,
                    profilePicture: res.data.secure_url
                };
                axios.put(`http://localhost:8800/api/users/${user._id}`, submitValue)
                    .then((res) => {
                        // HIỂN THỊ THÔNG BÁO CẬP NHẬT THÀNH CÔNG
                        enqueueSnackbar('Cập nhật thông tin thành công!', { variant: 'success' });
                        // CẬP NHẬT THÔNG TIN USER TRÊN LOCALSTORAGE
                        dispatch({ type: 'UPDATE_PROFILE', payload: res.data });
                        // ẨN THANH LOADING
                        setIsUpdating(false);
                    })
                    .catch((err) => {
                        // HIỂN THỊ THÔNG BÁO CẬP NHẬT THẤT BẠI
                        enqueueSnackbar(err.response.data, { variant: 'error' });
                        // ẨN THANH LOADING
                        setIsUpdating(false);
                    });
            })
            .catch(() => {
                enqueueSnackbar('Tải ảnh thất bại, vui lòng thử lại', { variant: 'error' });
                setIsUpdating(false);
            });
    };

    // MÃ HÓA FILE ĐỂ HIỂN THỊ RA MÀN HÌNH
    const previewFile = (file) => {
        const reader = new FileReader();
        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file);
        }
        reader.onloadend = () => {
            setImages([reader.result]);
        };
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setUploadImage(file);
    };

    return (
        <div className="avatar">
            <div className="avatar__btns">
                <input
                    accept="image/*"
                    id="contained-button-file"
                    onChange={handleFileInputChange}
                    multiple
                    type="file"
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary"
                        size="large"
                        component="span"
                        disableElevation
                        className="profile__submit-btn"
                    >
                        Tải ảnh lên
                    </Button>
                </label>
                <Button variant="contained" color="primary"
                    size="large"
                    component="span"
                    disabled={images ? false : true}
                    onClick={onSubmit}
                    disableElevation
                    className="profile__submit-btn"
                >
                    Cập nhật
                </Button>
            </div>
            {images && images.map((image, idx) => (
                <div
                    key={idx}
                    alt="chosen"
                    className="avatar__preview"
                    style={{
                        backgroundImage: `url('${image}')`
                    }}
                />
            ))}
            <div className="avatar__progress">
                { isUpdating && <LinearProgress /> }
            </div>

        </div>
    );
}
export default ChangeAvatar;