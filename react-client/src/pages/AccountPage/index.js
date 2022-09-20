/* eslint-disable indent */
import { yupResolver } from '@hookform/resolvers/yup';
import { Email, Google, Lock, School } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { green } from '@mui/material/colors';
import bg from 'assets/images/market.jpg';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import NotificateDialog from './NotificateDialog';
import './styles.scss';

function AccountPage() {
    const isLargeScreen = useMediaQuery('(min-width: 768px)');
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [showDialog, setShowDialog] = useState(false);
    const { dispatch } = useContext(AuthContext);

    const signupSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Thông tin này là bắt buộc'),
        password: Yup.string()
            .required('Thông tin này là bắt buộc')
            .min(6, 'Mật khẩu quá ngắn!')
            .max(50, 'Mật khẩu quá dài!'),
        username: Yup.string().required('Thông tin này là bắt buộc')
    });

    const signinSchema = Yup.object().shape({
        username: Yup.string()
            .min(6, 'Tên đăng nhập quá ngắn')
            .required('Thông tin này là bắt buộc'),
        password: Yup.string()
            .min(6, 'Mật khẩu quá ngắn!')
            .max(50, 'Mật khẩu quá dài!')
            .required('Thông tin này là bắt buộc')
    });

    const signinForm = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: yupResolver(signinSchema)
    });

    const signupForm = useForm({
        defaultValues: {
            email: '',
            username: '',
            password: ''
        },
        resolver: yupResolver(signupSchema)
    });

    const handleClick = () => {
        setIsLogin(!isLogin);
    };

    const handleShowDialog = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/v1/auth/login`,
                values
            );
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            enqueueSnackbar('Đăng nhập thành công', {
                variant: 'success'
            });
            history.push('/');
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE' });
            enqueueSnackbar(err?.response.data.message, {
                variant: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupSubmit = async (values) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/v1/auth/register`,
                values
            );
            enqueueSnackbar('Đăng ký thành công', {
                variant: 'success'
            });
            signupForm.reset();
        } catch (err) {
            // console.log(err.response.data.message);
            enqueueSnackbar(
                err.response.data.message || 'Có lỗi xảy ra, vui lòng thử lại!',
                {
                    variant: 'error'
                }
            );
        }
    };

    return (
        <div>
            <div className="account__left">
                {isLogin ? (
                    <div className="account__login-form">
                        <h3 className="account__title">Bắt đầu</h3>
                        <div className="account__redirect">
                            {'Bạn chưa có tài khoản'} &nbsp;
                            <Typography
                                onClick={handleClick}
                                sx={{
                                    textDecoration: 'underline',
                                    color: green[500],
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Đăng ký ngay
                            </Typography>
                        </div>
                        <div className="account__line">
                            <Button
                                variant="outlined"
                                startIcon={<Google />}
                                fullWidth
                                sx={{
                                    height: 50,
                                    backgroundColor: `${green[600]}!important`,
                                    borderColor: 'transparent!important',
                                    color: 'white',
                                    '& svg': {
                                        color: 'white'
                                    }
                                }}
                                onClick={handleShowDialog}
                            >
                                Google
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<School />}
                                fullWidth
                                onClick={handleShowDialog}
                                sx={{
                                    height: 50,
                                    backgroundColor: `${green[600]}!important`,
                                    borderColor: 'transparent!important',
                                    color: 'white',
                                    '& svg': {
                                        color: 'white'
                                    }
                                }}
                            >
                                Đông Á
                            </Button>
                        </div>
                        <div className="account__space">
                            <span>Hoặc</span>
                        </div>
                        <form
                            className="account__text-fields"
                            onSubmit={signinForm.handleSubmit(handleSubmit)}
                        >
                            <label className="account__label">Email</label>
                            <TextField
                                {...signinForm.register('username')}
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
                                spellCheck="false"
                                placeholder="Input your username"
                                name="username"
                                type="text"
                                error={!!signinForm.formState.errors.username}
                                helperText={
                                    signinForm.formState.errors.username?.message ?? ''
                                }
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
                                {...signinForm.register('password')}
                                error={!!signinForm.formState.errors.email}
                                helperText={
                                    signinForm.formState.errors.email?.message ?? ''
                                }
                            />
                            <div className="account__line">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked
                                            sx={{
                                                color: green[600],
                                                '&.Mui-checked': {
                                                    color: green[600]
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
                                variant="contained"
                                disableElevation
                                disabled={!isSubmitting ? false : true}
                                sx={{
                                    backgroundColor: `${green[600]}!important`,
                                    height: 50
                                }}
                            >
                                {!isSubmitting ? 'Đăng nhập' : 'Đang đăng nhập'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="account__register-form">
                        <h3 className="account__title">Đăng ký</h3>
                        <div className="account__redirect">
                            Bạn đã có tài khoản? &nbsp;
                            <Typography
                                onClick={handleClick}
                                sx={{
                                    textDecoration: 'underline',
                                    color: green[500],
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Đăng nhập ngay
                            </Typography>
                        </div>
                        <form
                            className="account__text-fields"
                            onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
                        >
                            <label className="account__label">Tên đăng nhập</label>
                            <TextField
                                {...signupForm.register('username')}
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
                                spellCheck="false"
                                placeholder="Nhập tên tài khoản"
                                name="username"
                                type="text"
                                error={!!signupForm.formState.errors.username}
                                helperText={
                                    signupForm.formState.errors.username?.message ?? ''
                                }
                            />
                            <label className="account__label">Email</label>
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
                                placeholder="Nhập địa chỉ email"
                                type="email"
                                name="email"
                                {...signupForm.register('email')}
                                error={!!signupForm.formState.errors.email}
                                helperText={
                                    signupForm.formState.errors.email?.message ?? ''
                                }
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
                                placeholder="Nhập mật khẩu"
                                type="password"
                                name="password"
                                {...signupForm.register('password')}
                                error={!!signupForm.formState.errors.password}
                                helperText={
                                    signupForm.formState.errors.password?.message ?? ''
                                }
                            />
                            <div className="account__line">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked
                                            sx={{
                                                color: green[600],
                                                '&.Mui-checked': {
                                                    color: green[600]
                                                }
                                            }}
                                        />
                                    }
                                    label="Tôi đồng ý với điều khoản sử dụng của trang web"
                                    spellCheck="false"
                                />
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disableElevation
                                sx={{
                                    backgroundColor: `${green[600]}!important`,
                                    height: 50
                                }}
                            >
                                Đăng ký
                            </Button>
                        </form>
                        <Formik
                            // khởi tạo giá trị mặc định cho 2 trường trong field
                            initialValues={{ email: '', password: '', username: '' }}
                            // tạo validate cho 2 trường đó
                            validationSchema={signupSchema}
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
                                        sx={{
                                            height: 50,
                                            backgroundColor: `${green[600]}!important`,
                                            '& svg': {
                                                color: 'white'
                                            }
                                        }}
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
                />
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
