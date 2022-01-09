/* eslint-disable indent */
import { Email, Google, Lock, School } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    TextField,
    useMediaQuery
} from '@mui/material';
import bg from 'assets/images/image8.jpg';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import NotificateDialog from './NotificateDialog';
import './styles.scss';

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Thông tin này là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu quá ngắn!')
        .max(50, 'Mật khẩu quá dài!')
        .required('Thông tin này là bắt buộc'),
    username: Yup.string().required('Thông tin này là bắt buộc')
});

const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Thông tin này là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu quá ngắn!')
        .max(50, 'Mật khẩu quá dài!')
        .required('Thông tin này là bắt buộc')
});

function AccountPage() {
    const isLargeScreen = useMediaQuery('(min-width: 768px)');
    const [isLogin, setIsLogin] = useState(true);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [showDialog, setShowDialog] = useState(false);
    const { dispatch } = useContext(AuthContext);

    const handleClick = () => {
        setIsLogin(!isLogin);
    };

    const handleShowDialog = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <div className="account">
            <div className="account__left">
                {isLogin ? (
                    <div className="account__login-form">
                        <h3 className="account__title">Bắt đầu</h3>
                        <div className="account__redirect">
                            {'Bạn chưa có tài khoản'} &nbsp;
                            <NavLink to="#" onClick={handleClick}>
                                Đăng ký ngay
                            </NavLink>
                        </div>
                        <div className="account__line">
                            <Button
                                variant="outlined"
                                startIcon={<Google />}
                                fullWidth
                                className="account__button account__other-login"
                                onClick={handleShowDialog}
                            >
                                Google
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<School />}
                                fullWidth
                                className="account__button account__other-login"
                                onClick={handleShowDialog}
                            >
                                Đông Á
                            </Button>
                        </div>
                        <div className="account__space">
                            <span>Hoặc</span>
                        </div>
                        <Formik
                            // khởi tạo giá trị mặc định cho 2 trường trong field
                            initialValues={{ email: '', password: '' }}
                            // tạo validate cho 2 trường đó
                            validationSchema={SigninSchema}
                            // xử lí sự kiện khi nhấn button submit trong LOGIN form
                            onSubmit={async (values) => {
                                // gọi api login
                                axios
                                    .post('http://localhost:8800/api/auth/login', {
                                        email: values.email,
                                        password: values.password
                                    })
                                    .then((res) => {
                                        // nếu đăng nhập thành công thì dispatch action LOGIN_SUCCESS
                                        // để lưu dữ liệu trả về vào localStorage
                                        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
                                        // hiển thị thông báo đăng nhập thành công
                                        enqueueSnackbar('Đăng nhập thành công', {
                                            variant: 'success'
                                        });
                                        // redirect về trang chủ
                                        history.push('/');
                                    })
                                    .catch(() => {
                                        // nếu đăng nhập thành công thì dispatch action LOGIN_FAILURE
                                        // để xóa localStorage
                                        dispatch({ type: 'LOGIN_FAILURE' });
                                        // hiển thị thông báo đăng nhập thất bại
                                        enqueueSnackbar('Tài khoản hoặc mật khẩu sai', {
                                            variant: 'error'
                                        });
                                    });
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting
                            }) => (
                                <form
                                    className="account__text-fields"
                                    onSubmit={handleSubmit}
                                >
                                    <label className="account__label">Email</label>
                                    <TextField
                                        autoFocus
                                        autoComplete="true"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Input your username"
                                        type="text"
                                        name="email"
                                        className="account__gray-bg"
                                        spellCheck="false"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.email && touched.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                    <label className="account__label">Mật khẩu</label>
                                    <TextField
                                        autoComplete="true"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Input your password"
                                        type="password"
                                        name="password"
                                        className="account__gray-bg"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        error={Boolean(
                                            touched.password && touched.password
                                        )}
                                        helperText={touched.password && errors.password}
                                    />
                                    <div className="account__line">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked
                                                    sx={{
                                                        color: '#FE725D',
                                                        '&.Mui-checked': {
                                                            color: '#FE725D'
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Lưu đăng nhập"
                                            spellCheck="false"
                                        />
                                        <NavLink to="#" onClick={handleShowDialog}>
                                            Quên mật khẩu
                                        </NavLink>
                                    </div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        className="account__button account__submit"
                                        variant="contained"
                                        disableElevation
                                        disabled={isSubmitting}
                                        onSubmit={handleSubmit}
                                    >
                                        Đăng nhập
                                    </Button>
                                </form>
                            )}
                        </Formik>
                    </div>
                ) : (
                    <div className="account__register-form">
                        <h3 className="account__title">Đăng ký</h3>
                        <div className="account__redirect">
                            Bạn đã có tài khoản? &nbsp;
                            <NavLink to="#" onClick={handleClick}>
                                Đăng nhập ngay
                            </NavLink>
                        </div>
                        <Formik
                            // khởi tạo giá trị mặc định cho 2 trường trong field
                            initialValues={{ email: '', password: '', username: '' }}
                            // tạo validate cho 2 trường đó
                            validationSchema={SignupSchema}
                            // xử lí sự kiện khi nhấn button submit trong REGISTER form
                            onSubmit={async (values) => {
                                axios
                                    .post('http://localhost:8800/api/auth/register', {
                                        email: values.email,
                                        password: values.password,
                                        username: values.username
                                    })
                                    .then(() => {
                                        // CHUYỂN VỀ LẠI TRANG LOGIN
                                        handleClick();
                                        // HIỂN THỊ THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG
                                        enqueueSnackbar('Đăng ký thành công', {
                                            variant: 'success'
                                        });
                                    })
                                    .catch((err) => {
                                        // HIỂN THỊ THÔNG BÁO ĐĂNG KÝ THẤT BẠI
                                        enqueueSnackbar(err.response.data.error, {
                                            variant: 'error'
                                        });
                                    });
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting
                            }) => (
                                <form
                                    className="account__text-fields"
                                    onSubmit={handleSubmit}
                                >
                                    <label className="account__label">Email</label>
                                    <TextField
                                        autoFocus
                                        autoComplete="true"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Input your username"
                                        type="text"
                                        name="email"
                                        className="account__gray-bg"
                                        spellCheck="false"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.email && touched.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                    <label className="account__label">Mật khẩu</label>
                                    <TextField
                                        autoComplete="true"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Input your password"
                                        type="password"
                                        name="password"
                                        className="account__gray-bg"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        error={Boolean(
                                            touched.password && touched.password
                                        )}
                                        helperText={touched.password && errors.password}
                                    />
                                    <label className="account__label">Tên của bạn</label>
                                    <TextField
                                        autoFocus
                                        autoComplete="true"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Input your username"
                                        type="text"
                                        name="username"
                                        className="account__gray-bg"
                                        spellCheck="false"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(
                                            touched.username && touched.username
                                        )}
                                        helperText={touched.username && errors.username}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        className="account__button account__submit"
                                        variant="contained"
                                        disableElevation
                                        disabled={isSubmitting}
                                        onSubmit={handleSubmit}
                                    >
                                        Đăng ký
                                    </Button>
                                </form>
                            )}
                        </Formik>
                    </div>
                )}
            </div>
            {isLargeScreen && (
                <div
                    className="account__right"
                    style={{ backgroundImage: `url('${bg}')` }}
                ></div>
            )}
            {showDialog && (
                <NotificateDialog
                    showDialog={showDialog}
                    handleDialogClose={handleDialogClose}
                />
            )}
        </div>
    );
}

export default AccountPage;
