
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import { Formik, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';
import * as yup from 'yup';
import ChangePassword from '../ChangePassword';
import './styles.scss';

function EditInfo() {
    const { enqueueSnackbar } = useSnackbar();
    const { user, dispatch } = useContext(AuthContext);

    // KHỞI TẠO FORMIK TỪ USEFORMIK
    const formik = useFormik({
        initialValues: {
            username: user?.username,
            phone: user?.phone,
            address: user?.address,
            email: user?.email,
            age: user?.age,
            gender: user?.gender || 'Bí mật'
        },
        validationSchema:  yup.object().shape({
            username: yup.string()
                .required('Đây là yêu cầu bắt buộc!')
                .min(2, 'Tên phải có ít nhất 2 ký tự')
                .max(50, 'Tên quá dài'),
            phone: yup.string()
                .required('Đây là thông tin bắt buộc!')
                .max(10, 'Số điện thoại quá dài')
                .min(9, 'Số điện thoại quá ngắn!')
                .matches(/(84|0[3|5|7|8|9])+([0-9]{8})/, 'Số điện thoại không đúng!'),
            address: yup.string()
                .required('Đây là thông tin bắt buộc!'),
            email: yup.string()
                .required('Đây là thông tin bắt buộc!')
                .email('Không đúng dạng email'),
            age: yup.number('Tuổi phải là số!')
                .min(10, 'Tối thiểu phải 1 tuổi chứ!')
                .max(120, 'Tối đa là 120 tuổi')
                .required('Đây là thông tin bắt buộc!')
        })
        ,
        onSubmit: async (values) => {
            let submitValue = { ...user, ...values };
            // GỌI API CẬP NHẬT THÔNG TIN USER
            axios.put(`http://localhost:8800/api/users/${user._id}`, submitValue)
                .then((res) => {
                    // HIỂN THỊ THÔNG BÁO CẬP NHẬT THÔNG TIN THÀNH CÔNG
                    enqueueSnackbar('Cập nhật thông tin thành công!', { variant: 'success' });
                    // CẬP NHẬT THÔNG TIN USER TRONG LOCALSTORAGE
                    dispatch({ type: 'UPDATE_PROFILE', payload: res.data });
                })
                .catch((err) => {
                    // HIỂN THỊ THÔNG BÁO CẬP NHẬT THẤT BẠI
                    enqueueSnackbar(err.response.data.error, { variant: 'err' });
                });
        } });

    return (
        <Formik>
            <Grid
                container
                spacing={3}
                direction="row"
                justifycontent="space-between"
                alignitems="flex-start"
            >
                <Grid item xs={6}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="account__dialog--line">
                            <TextField
                                error={Boolean(formik.touched.username && formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                label="Họ và tên"
                                margin="normal"
                                name="username"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.username}
                                variant="outlined"
                                className="account__dialog--input"
                            />
                            <div className="account__dialog--line-2">
                                <TextField
                                    error={Boolean(formik.touched.age && formik.errors.age)}
                                    helperText={formik.touched.age && formik.errors.age}
                                    label="Tuổi"
                                    margin="normal"
                                    name="age"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="number"
                                    value={formik.values.age}
                                    variant="outlined"
                                    className="account__dialog--small-input"
                                />
                                <FormControl variant="outlined" className="account__dialog--small-input account__dialog--form-control">
                                    <InputLabel id="demo-simple-select-outlined-label">Giới tính</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        onChange={formik.handleChange}
                                        label="Tuổi"
                                        name="gender"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.gender}
                                        variant="outlined"
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Bí mật">Bí mật</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <TextField
                                error={Boolean(formik.touched.address && formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                                label="Địa chỉ"
                                margin="normal"
                                name="address"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.address}
                                variant="outlined"
                                className="account__dialog--input"
                            />
                        </div>
                        <div className="account__dialog--line">
                            <TextField
                                error={Boolean(formik.touched.phone && formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                                label="Điện thoại"
                                margin="normal"
                                name="phone"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.phone}
                                variant="outlined"
                                className="account__dialog--input"
                            />
                            <TextField
                                error={Boolean(formik.touched.email && formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                label="Email"
                                margin="normal"
                                name="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.email}
                                variant="outlined"
                                className="account__dialog--input"
                                disabled
                            />
                        </div>

                        <div className="account__dialog--line">
                            <Button
                                color="primary"
                                size="large"
                                type="submit"
                                variant="contained"
                                onSubmit={formik.handleSubmit}
                                disableElevation
                                className="profile__submit-btn"
                            >Lưu thay đổi</Button>
                        </div>
                    </form>
                </Grid>
                <Grid item xs={6}>
                    <ChangePassword/>
                </Grid>
            </Grid>
        </Formik>
    );
}

export default EditInfo;