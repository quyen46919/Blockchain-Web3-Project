/* eslint-disable indent */
import { yupResolver } from '@hookform/resolvers/yup';
import { Email, Google, Lock, School } from '@mui/icons-material';
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
import { AuthContext } from 'context/AuthContext';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import NotificateDialog from './NotificateDialog';
import './styles.scss';

function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [showDialog, setShowDialog] = useState(false);
    const { dispatch } = useContext(AuthContext);

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

    const handleClick = () => {
        history.push('/logup');
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

    return (
        <Stack width='100%' flexDirection="row" position="relative" justifyContent="center" alignItems="center">
            <Box className="account__left">
                    <div className="account__login-form">
                        <h3 className="account__title">Đăng nhập</h3>
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
            </Box>
            <Stack
                className="account__right"
                width="100%"
                height="100vh"
            >
                <Box sx={{ width: '100%', height: '100vh', bgcolor: 'rgba(0, 0, 0, 0.2)', position: 'absolute' }}/>
                <Box sx={{
                    backgroundImage: `url('${bg}')`, width: '100%', height: '100vh',
                    backgroundSize: 'cover'
                }}/>
            </Stack>
            {showDialog && (
                <NotificateDialog
                    showDialog={showDialog}
                    handleDialogClose={handleDialogClose}
                />
            )}
        </Stack>
    );
}

export default LoginPage;
