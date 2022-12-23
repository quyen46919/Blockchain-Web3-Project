/* eslint-disable indent */
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountBox, Lock } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { green } from '@mui/material/colors';
import bg from 'assets/images/market.jpg';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import NotificateDialog from './NotificateDialog';
import './styles.scss';

function RegisterPage() {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [showDialog, setShowDialog] = useState(false);

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

    const signupForm = useForm({
        defaultValues: {
            email: '',
            username: '',
            password: ''
        },
        resolver: yupResolver(signupSchema)
    });

    const handleClick = () => {
        history.push('/login');
    };

    const handleDialogClose = () => {
        setShowDialog(false);
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
        <Stack
            width="100%"
            flexDirection="row"
            position="relative"
            justifyContent="center"
            alignItems="center"
        >
            <Box className="account__left">
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
                        <label className="account__label">Họ và tên</label>
                        <TextField
                            {...signupForm.register('username')}
                            autoFocus
                            autoComplete="true"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBox />
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
                            helperText={signupForm.formState.errors.email?.message ?? ''}
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
                </div>
            </Box>
            {/* {isLargeScreen && ( */}
            <Stack className="account__right" width="100%" height="100vh">
                <Box
                    sx={{
                        width: '100%',
                        height: '100vh',
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        position: 'absolute'
                    }}
                />
                <Box
                    sx={{
                        backgroundImage: `url('${bg}')`,
                        width: '100%',
                        height: '100vh',
                        backgroundSize: 'cover'
                    }}
                />
            </Stack>
            {/* )} */}
            {showDialog && (
                <NotificateDialog
                    showDialog={showDialog}
                    handleDialogClose={handleDialogClose}
                />
            )}
        </Stack>
    );
}

export default RegisterPage;
