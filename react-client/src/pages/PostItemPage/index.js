import { yupResolver } from '@hookform/resolvers/yup';
import { CloudUpload } from '@mui/icons-material';
import { Button, CircularProgress, FormHelperText, InputAdornment, MenuItem, OutlinedInput, TextField } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import ItemManagerContract from 'contracts/ItemManager.json';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import getWeb3 from '../../getWeb3';
import './styles.scss';

function PostItemPage() {
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [itemManagerContract, setItemManagerContract] = useState({});
    const [account, setAccount] = useState([]);
    const { user } = useContext(AuthContext);
    const { metamaskAddress, dispatch } = useContext(AuthContext);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        maxFiles: 8
    });

    useEffect(() => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const onInit = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await window.ethereum.send('eth_requestAccounts');
            const networkId = await web3.eth.net.getId();
            const itemManager = new web3.eth.Contract(
                ItemManagerContract.abi,
                ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
            );

            setAccount(accounts.result[0]);
            setItemManagerContract(itemManager);
            if (accounts.result[0].length > 1) {
                dispatch({ type: 'CHANGE_METAMASK', payload: accounts.result[0] });
            }
        } catch (error) {
            enqueueSnackbar('Kh??ng t??m th???y web3 trong tr??nh duy???t, vui l??ng F5 v?? th??? l???i!', {
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            dispatch({ type: 'CHANGE_METAMASK', payload: accounts[0] });
        });
        window.ethereum.on('chainChanged', () => window.location.reload());
    }

    const form = useForm({
        defaultValues: {
            identify: '',
            price: 0,
            images: [],
            history: [],
            description: '',
            category: 'H??ng ti??u d??ng'
        },
        resolver: yupResolver(
            Yup.object().shape({
                identify: Yup.string()
                    .required('Th??ng tin n??y l?? b???t bu???c')
                    .min(10, 'T??n s???n ph???m qu?? ng???n')
                    .max(128, 'T??n s???n ph???m qu?? d??i'),
                price: Yup.number()
                    .min(1, 'Gi?? kh??ng ???????c d?????i 1 wei')
                    .max(10000000000000000000, 'Gi?? t???i ??a l?? 10 ethers')
                    .required('Th??ng tin n??y l?? b???t bu???c'),
                images: Yup.array().required('Th??ng tin n??y l?? b???t bu???c'),
                history: Yup.array(),
                description: Yup.string()
                    .max(255, 'M?? t??? qu?? d??i'),
                category: Yup.string().required()
            }))
    });

    const handleSubmit = async (values) => {
        if (files.length < 4) {
            enqueueSnackbar('??t nh???t ph???i t???i l??n 4 ???nh', {
                variant: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        const uploaders = files.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
            formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);

            return axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_DOC_NAME}/image/upload`,
                formData,
                { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(response => {
                    const data = response.data;
                    return data.secure_url;
                });
        });

        try {
            const uploadedImages = await axios.all(uploaders);
            const hashString = await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/items/encrypt`,
                {
                    identify: values.identify,
                    images: uploadedImages,
                    description: values.description
                });

            const result = await itemManagerContract.methods.createItem(
                metamaskAddress, values.identify, values.price.toString(), hashString.data
            ).send({ from: metamaskAddress });

            const newItem = result.events.SupplyChainStep.returnValues;
            console.log(newItem);

            const newItemToCreate = {
                createUserId: user.user.id,
                ownerId: account,
                itemAddress: newItem._itemAddress,
                identify: values.identify,
                category: values.category,
                price: values.price,
                images: uploadedImages,
                description: values.description,
                history: [hashString.data],
                itemIndex: newItem._itemIndex
            };
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/items/`, newItemToCreate);

            enqueueSnackbar('????ng s???n ph???m th??nh c??ng', {
                variant: 'success'
            });

            form.reset();
            setFiles([]);

        } catch (err) {
            enqueueSnackbar('C?? l???i x???y ra, vui l??ng f5 v?? th??? l???i!', {
                variant: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const thumbs = files.map(file => (
        <div key={file.name}>
            <div >
                <img
                    src={file.preview}
                    className="post-item-page__img"
                />
            </div>
        </div>
    ));

    return (
        <form className="post-item-page" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="post-item-page__container">
                <section className="post-item-page__upload-image">
                    <div className="post-item-page__dropzone" {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <CloudUpload sx={{ fontSize: 120, color: grey[500] }}/>
                        <p>Nh???n ho???c k??o th??? ???nh to??n b??? ???nh v??o ????y ????? t???i l??n</p>
                        <em>(Upload t???i thi???u 4 ???nh, t???i ??a 8 ???nh, ch???t l?????ng d?????i 20MB)</em>
                    </div>
                    { files && <div className="post-item-page__img-wrap">
                        {thumbs}
                    </div> }
                </section>
                <section className="post-item-page__infos">
                    <OutlinedInput
                        placeholder="Nh???p t??n s???n ph???m"
                        spellCheck="false"
                        fullWidth
                        multiline
                        sx={{
                            '& textarea': { lineHeight: 1.4 },
                            '& .MuiInput-underline:after': { borderColor: green[600] },
                            '&.Mui-focused fieldset': { borderColor: `${green[600]}!important` }
                        }}
                        { ...form.register('identify') }
                        error={!!form.formState.errors.identify}
                    />
                    { form.formState.errors.identify?.message
                        ? <FormHelperText sx={{ color: red[500] }} >{form.formState.errors.identify?.message}</FormHelperText>
                        : ''
                    }
                    <TextField
                        select
                        fullWidth
                        { ...form.register('category') }
                        onChange={e => form.setValue('category', e.target.value, { shouldValidate: true })}
                        defaultValue="H??ng ti??u d??ng"
                        sx={{
                            mt: 2,
                            '&:hover fieldset, & .MuiOutlinedInput-notchedOutline': {
                                borderColor: `${green[600]}!important`
                            }
                        }}
                        error={!!form.formState.errors.category}
                        helperText={form.formState.errors.category?.message ?? ''}
                    >
                        <MenuItem value="H??ng ti??u d??ng">H??ng ti??u d??ng</MenuItem>
                        <MenuItem value="Th???c ph???m">Th???c ph???m</MenuItem>
                        <MenuItem value="????? c??ng ngh???">????? c??ng ngh???</MenuItem>
                        <MenuItem value="Kh??c">Kh??c</MenuItem>
                    </TextField>
                    <OutlinedInput
                        placeholder="Gi?? s???n ph???m"
                        variant="standard"
                        spellCheck="false"
                        type="number"
                        { ...form.register('price') }
                        fullWidth
                        endAdornment={<InputAdornment position="end">wei</InputAdornment>}
                        sx={{
                            mt: 2,
                            '& .MuiInput-underline:after': { borderColor: green[600] },
                            '&.Mui-focused fieldset': { borderColor: `${green[600]}!important` }
                        }}
                        error={!!form.formState.errors.price}
                    />
                    { form.formState.errors.price?.message
                        ? <FormHelperText sx={{ color: red[500] }} >{form.formState.errors.price?.message}</FormHelperText>
                        : ''
                    }
                    <TextField
                        { ...form.register('description') }
                        autoComplete="true"
                        fullWidth
                        spellCheck="false"
                        placeholder="Nh???p m?? t??? s???n ph???m"
                        multiline
                        error={!!form.formState.errors.username}
                        helperText={form.formState.errors.username?.message ?? ''}
                        sx={{
                            mt: 2,
                            '& .Mui-focused fieldset': { borderColor: `${green[600]}!important` }
                        }}
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        type="submit"
                        disabled={isSubmitting ? true : false}
                        sx={{
                            height: 50,
                            backgroundColor: `${green[600]}!important`,
                            color: 'white!important',
                            border: 'none!important',
                            mt: 2,
                            borderColor: `${green[600]}!important`
                        }}
                    >
                        { isSubmitting && <CircularProgress size={20} sx={{ m: 2, color: 'white' }}/> }
                        { isSubmitting ? '??ang ????ng t???i' : '????ng s???n ph???m' }
                    </Button>
                </section>
            </div>
        </form>
    );
}

export default PostItemPage;