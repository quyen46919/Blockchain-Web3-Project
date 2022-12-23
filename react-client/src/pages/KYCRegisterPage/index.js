import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import registIllu from 'assets/images/regist.jpg';
import NotificationDialog from 'components/NotificationDialog';
import { AuthContext } from 'context/AuthContext';
import getWeb3 from 'getWeb3';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

function KYCRegisterPage() {
    const { user, dispatch: contextDispatch } = useContext(AuthContext);
    const { user: userInfo } = user;
    const [account, setAccount] = useState('');
    const [validAccount, setValidAccount] = useState(false);
    const history = useHistory();
    const kycRef = useRef();
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    const handleAcceptDialog = () => {
        history.go(0);
    };

    const { register, handleSubmit, setValue, formState } = useForm({
        defaultValues: {
            kycAddress: '',
            fullName: '',
            phone: '',
            email: ''
        },
        resolver: yupResolver(
            Yup.object().shape({
                kycAddress: Yup.string()
                    .required('Thông tin này là bắt buộc'),
                fullName: Yup.string()
                    .required('Thông tin này là bắt buộc'),
                phone: Yup.string()
                    .required('Thông tin này là bắt buộc'),
                email: Yup.string()
                    .email('Email không hợp lệ')
                    .required('Thông tin này là bắt buộc')
            })
        )
    });

    useEffect(() => {
        if (userInfo?.username && userInfo?.email && userInfo?.email) {
            setValue('fullName', userInfo?.username);
            setValue('email', userInfo?.email);
            setValue('phone', userInfo?.phone);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    useEffect(() => {
        const initLoad = async () => {
            try {
                const { kycInstance, isValidAccount, account } = await getWeb3();
                kycRef.current = kycInstance;
                setValidAccount(isValidAccount);
                setAccount(account);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            }
        };
        initLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (kycRef.current && account) {
            checkKycWhiteList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kycRef, account]);

    window.ethereum.on('accountsChanged', function (accounts) {
        checkKycWhiteList();
        setAccount(accounts[0]);
        setValue('kycAddress', accounts[0]);
    });

    const checkKycWhiteList = async () => {
        try {
            const isValidAccount = await kycRef.current.methods.kycCompleted(account).call();
            contextDispatch({ type: 'SET_KYC_USER', payload: isValidAccount });
            setValidAccount(isValidAccount);
            if (isValidAccount) {
                history.push('/token');
            }
        } catch (err) {
            handleShowDialog();
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            await kycRef.current.methods.setKycCompleted(
                values.kycAddress, values.fullName, values.phone, values.email
            ).send({ from: account });
            checkKycWhiteList();
        } catch (err) {
            handleShowDialog();
        }
    };

    return (
        <Box width="80%" p="20px 30px" boxSizing="border-box">
            {validAccount ? (
                <Typography>Tài khoản của bạn đã được xác thực, đang chuyển hướng...</Typography>
            ) : (
                <Stack flexDirection="row" gap="50px" alignItems="center">
                    <Box sx={{
                        '& img': {
                            width: '100%',
                            height: 500,
                            objectFit: 'cover'
                        }
                    }}>
                        <img src={registIllu} alt="regist here"/>
                    </Box>
                    <Stack gap="20px" flexGrow={1}>
                        <Typography fontSize="30px" fontWeight={700} color={green[800]}>
                            ĐĂNG KÝ KYC
                        </Typography>
                        <Stack
                            component="form"
                            flexDirection="column"
                            gap="20px"
                            my="10px"
                            onSubmit={handleSubmit(handleFormSubmit)}
                        >
                            <TextField
                                {...register('kycAddress')}
                                label="Nhập address ví của bạn"
                                spellCheck="false"
                                type="text"
                                error={!!formState.errors.kycAddress}
                                helperText={formState.errors.kycAddress?.message}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                {...register('fullName')}
                                label="Họ và tên"
                                spellCheck="false"
                                type="text"
                                error={!!formState.errors.fullName}
                                helperText={formState.errors.fullName?.message}
                            />
                            <TextField
                                {...register('phone')}
                                label="Số điện thoại của bạn"
                                spellCheck="false"
                                type="text"
                                error={!!formState.errors.phone}
                                helperText={formState.errors.phone?.message}
                            />
                            <TextField
                                {...register('email')}
                                label="Email của bạn"
                                spellCheck="false"
                                type="email"
                                error={!!formState.errors.email}
                                helperText={formState.errors.email?.message}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked
                                        disabled
                                        sx={{
                                            color: green[600],
                                            '&.Mui-checked': {
                                                color: green[600]
                                            }
                                        }}
                                    />
                                }
                                label="Tôi hiểu và chấp nhận mọi điều khoản khi đăng ký KYC"
                                spellCheck="false"
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    width: 200,
                                    height: 45,
                                    backgroundColor: `${green[600]}!important`,
                                    borderColor: 'transparent!important',
                                    color: 'white',
                                    '& svg': {
                                        color: 'white'
                                    }
                                }}
                            >
                            Đăng ký
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            )}
            {showDialog && (
                <NotificationDialog
                    showDialog={showDialog}
                    handleDialogClose={handleDialogClose}
                    handleAcceptDialog={handleAcceptDialog}
                />
            )}
        </Box>
    );
}

export default KYCRegisterPage;
