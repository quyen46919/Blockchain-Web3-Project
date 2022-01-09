import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Button, Grid, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';

const useStyles = makeStyles(() => ({
    line: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& input': {
            width: '100%',
            minWidth: '400px'
        },
        '&:last-child' : {
            marginTop: '1rem'
        }
    }
}));
const Schema = Yup.object().shape({
    oldPassword: Yup.string()
        .required('Đây là trường bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu ít nhất 6 kí tự')
        .when('oldPassword', {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().notOneOf(
                [Yup.ref('oldPassword')],
                'Mật khẩu mới trùng mật khẩu cũ'
            )
        })
        .required('Đây là trường bắt buộc'),
    confirmPassword: Yup.string()
        .when('password', {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
                [Yup.ref('password')],
                'Mật khẩu không trùng khớp'
            )
        })
        .required('Đây là trường bắt buộc')
});

function ChangePassword() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { user, dispatch } = useContext(AuthContext);

    return (
        <Formik
            // KHỞI TẠO DỮ LIỆU MẪU
            initialValues={{
                oldPassword: '',
                password: '',
                confirmPassword: ''
            }}
            // TẠO VALIDATE CHO CÁC TRƯỜNG TRONG FORM
            validationSchema={Schema}
            onSubmit={async (values) => {
                // GỌI API CẬP NHẬT MẬT KHẨU
                axios.put(`http://localhost:8800/api/users/password/${user._id}`, values)
                    .then(() => {
                        // HIỂN THỊ THÔNG BÁO CẬP NHẬT MẬT KHẨU THÀNH CÔNG
                        enqueueSnackbar('Cập nhật mật khẩu thành công, vui lòng đăng nhập lại!', { variant: 'success' });
                        // XÓA THÔNG TIN USER TRONG LOCALSTORAGE ĐỂ NGƯỜI DÙNG ĐĂNG NHẬP LẠI
                        dispatch({ type: 'LOGOUT' });
                    })
                    .catch((err) => {
                        // HIỂN THỊ THÔNG BÁO CẬP NHẬT THÔNG TIN THẤT BẠI
                        enqueueSnackbar(err.response.data.error, { variant: 'err' });
                    });
            }}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
            }) => (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <form onSubmit={handleSubmit}>
                        <div className={classes.line}>
                            <TextField
                                error={Boolean(touched.oldPassword && errors.oldPassword)}
                                helperText={touched.oldPassword && errors.oldPassword}
                                label="Mật khẩu hiện tại"
                                margin="normal"
                                name="oldPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.oldPassword}
                                variant="outlined"
                                autoComplete='true'
                            />

                            <TextField
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                label="Mật khẩu mới"
                                margin="normal"
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.password}
                                variant="outlined"
                                autoComplete='true'
                            />
                            <TextField
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                label="Nhập lại mật khẩu"
                                margin="normal"
                                name="confirmPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.confirmPassword}
                                variant="outlined"
                                autoComplete='true'
                            />
                        </div>

                        <div className={classes.line}>
                            <Button
                                color="primary"
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                disableElevation
                                size="large"
                                className="profile__submit-btn"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </Grid>
            )}
        </Formik>

    );
}

export default ChangePassword;