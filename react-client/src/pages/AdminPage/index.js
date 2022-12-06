import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { green, grey, red } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import requestLoadMetamask from 'assets/images/req_load_metamask.jpg';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import ItemManagerContract from 'contracts/ItemManager.json';
import { ethers } from 'ethers';
import { motion } from 'framer-motion/dist/framer-motion';
import getWeb3 from 'getWeb3';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { convertState } from 'utils/convertState';
import Web3 from 'web3';
import './styles.scss';

const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
    theme.palette.mode === 'dark'
        ? '0 0 0 1px rgb(16 22 20 / 40%)'
        : 'inset 0 0 0 1px rgba(16,22,20,.2), inset 0 -1px 0 rgba(16,22,20,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 102, 255)' : '#f5f8fa',
    backgroundImage:
    theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
        : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
        outline: '2px auto rgb(0, 102, 255)',
        outlineOffset: 2
    },
    'input:hover ~ &': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 102, 255)' : '#ebf1f5'
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background:
      theme.palette.mode === 'dark' ? 'rgb(0, 102, 255)' : 'rgba(206,217,224,.5)'
    }
}));

const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: 'rgb(0, 102, 255)',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
        content: '""'
    },
    'input:hover ~ &': {
        backgroundColor: 'rgb(0, 204, 255)'
    }
});
// Inspired by blueprintjs
function BpRadio(props) {
    return (
        <Radio
            sx={{
                '&:hover': {
                    bgcolor: 'transparent'
                }
            }}
            disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            {...props}
        />
    );
}
function AdminPage() {
    const [age, setAge] = useState(10);
    const [errorMessage, setErrorMessage] = useState(null);
    const { dispatch, metamaskAddress } = useContext(AuthContext);
    const [defaultAccount, setDefaultAccount] = useState(metamaskAddress);
    const [userBalance, setUserBalance] = useState(null);
    const [defaultAccountInfo, setDefaultAccountInfo] = useState(0);
    const [postedItems, setPostedItems] = useState([]);
    const [itemManagerContract, setItemManagerContract] = useState();
    const [paidAmount, setPaidAmount] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const connectWallet = async () => {
        try {
            const web3 = await getWeb3();
            const networkId = await web3.eth.net.getId();
            const itemManager = new web3.eth.Contract(
                ItemManagerContract.abi,
                ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
            );
            setItemManagerContract(itemManager);
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra, vui lòng f5 và thử lại!', {
            //     variant: 'error'
            // });
        }
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    handleAccountChange(result[0]);
                });
        } else {
            setErrorMessage('Hãy cài đặt ví Metamask vào trình duyệt của bạn!');
        }
    };

    useEffect(() => {
        connectWallet();
        const fetchAllItemByOwnerId = async () => {
            try {
                // console.log(metamaskAddress);
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/items/owner/${metamaskAddress}`);
                // console.log(res);
                setPostedItems(res.data.items);
                setDefaultAccountInfo(Web3.utils.fromWei(res.data.infos.totalPrice[0].totalAmount.toString(), 'ether'));

                const x = res.data.items.filter((x) => x.state === 2).map(item => item.price).reduce((prev, next) => prev + next);
                setPaidAmount(Web3.utils.fromWei(x.toString(), 'ether'));
            } catch (err) {
                // enqueueSnackbar('Có lỗi xảy ra, vui lòng f5 và thử lại!', {
                //     variant: 'error'
                // });
            }
        };
        fetchAllItemByOwnerId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccountChange = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
        dispatch({ type: 'CHANGE_METAMASK', payload: newAccount });
    };

    const getUserBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(balance => {
                setUserBalance(ethers.utils.formatEther(balance));
            });
    };

    const handleChainChange = () => {
        window.location.reload();
    };

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', handleChainChange);
    }

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleTriggerPayment = async (item) => {
        try {
            await itemManagerContract.methods.triggerDelivery(item.itemIndex).send({ from: metamaskAddress });
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/v1/items/${item.id}`, { state: 2 });
            enqueueSnackbar('Giao hàng thành công', {
                variant: 'success'
            });
            window.location.reload();
        } catch (err) {
            enqueueSnackbar('Giao hàng thất bại, vui lòng F5 và thử lại!', {
                variant: 'error'
            });
        }
    };

    return (
        <motion.div
            exit={{ opacity: 0 }}
            initial = {{ y: -60, opacity: 0 }}
            animate = {{ y: 0, opacity: 1 }}
            transition = {{ delay: .2 }}
            className="admin-page"
        >
            {
                defaultAccount === '' ?
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                width: '50%',
                                height: 460,
                                backgroundImage: `url(${requestLoadMetamask})`,
                                backgroundSize: 'cover'
                            }}
                        />
                        {
                            errorMessage
                                ? <Typography sx={{ color: red[600], fontSize: 26 }}>{errorMessage}</Typography>
                                : <>
                                    <Typography sx={{ fontSize: 26 }}>
                                        Không tìm thấy kết nối với ví metamask của bạn
                                    </Typography>
                                    <Button variant="contained" disableElevation
                                        sx={{
                                            background: `${green[600]}!important`,
                                            mt: 2
                                        }}
                                        onClick={connectWallet}
                                    >
                                        Kết nối với Metamask
                                    </Button>
                                </>
                        }
                    </Box> :
                    <>
                        <div className="admin-page__savings">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    pt: 3
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            textTransform: 'uppercase',
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: green[600]
                                        }}
                                    >
                                        Quản lí tiêu dùng
                                    </Typography>
                                    <Typography sx={{ color: grey[600], fontSize: 16 }}>
                                        Cập nhật lần cuối vào 25/01/2022 12:20 am
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            textAlign: 'left',
                                            width: 'auto'
                                        }}>
                                        <Typography sx={{ width: 150 }}>Address hiện tại: </Typography>
                                        <Typography sx={{ color: green[600], fontWeight: 700 }}>{defaultAccount}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            textAlign: 'left',
                                            width: 'auto'
                                        }}
                                    >
                                        <Typography sx={{ width: 150 }}>Số dư hiện tại: </Typography>
                                        <Typography sx={{ color: green[600], fontWeight: 700 }}>{userBalance} ethers</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <div className="admin-page__totals">
                                <div className="admin-page__element">
                                    <Typography sx={{ color: grey[400], fontSize: 18, fontWeight: 500 }}>
                                        Tổng số ether của các sản phẩm bạn đăng tải
                                    </Typography>
                                    <h2 className='admin-page__possible'>{defaultAccountInfo} ethers</h2>
                                </div>
                                <div className="admin-page__element">
                                    <Typography sx={{ color: grey[400], fontSize: 18, fontWeight: 500 }}>
                                        Tổng số ether của hàng hóa đã bán
                                    </Typography>
                                    <h2 className='admin-page__possible'>{paidAmount} ethers</h2>
                                </div>
                            </div>
                        </div>
                        <Box
                            sx={{
                                width: '100%',
                                pt: 4,
                                pb: 4,
                                borderTop: `1px solid ${grey[200]}`
                            }}
                        >
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: green[600],
                                    pb: 2
                                }}
                            >
                                Thống kê sản phẩm
                            </Typography>
                            <div className="admin-page__row">
                                <div className="admin-page__project">
                                    <div className="admin-page__title">
                                        Giá trị sản phẩm
                                    </div>
                                    <div className="admin-page__project--content">
                                        <p>Giá trần</p>
                                        <h3>12.12412 ethers</h3>
                                        <p>Phí VAT</p>
                                        <h3>0.6212 ethers</h3>
                                    </div>
                                </div>
                                <div className="admin-page__instances">
                                    <div className="admin-page__title">
                                        Phân loại sản phẩm
                                    </div>
                                    <div className="admin-page__instances--content">
                                        <div className="admin-page__type">
                                            <FormControl>
                                                <FormLabel id="demo-customized-radios">Danh mục</FormLabel>
                                                <RadioGroup
                                                    defaultValue="no"
                                                    aria-labelledby="demo-customized-radios"
                                                    name="customized-radios"
                                                    sx={{
                                                        '& span.Mui-checked span': {
                                                            backgroundColor: `${green[600]}!important`
                                                        }
                                                    }}
                                                >
                                                    <FormControlLabel value="asd" control={<BpRadio />} label="Tất cả" />
                                                    <FormControlLabel value="no" control={<BpRadio />} label="Hàng tiêu dùng" />
                                                    <FormControlLabel value="partial" control={<BpRadio />} label="Linh kiện điện tử" />
                                                    <FormControlLabel value="all" control={<BpRadio />} label="Thực phẩm" />
                                                    <FormControlLabel value="asfll" control={<BpRadio />} label="Khác" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="admin-page__offering">
                                            <FormControl>
                                                <FormLabel id="demo-customized-radios" className = 'admin-page__custom'>
                                                    <span>Trạng thái</span>
                                                </FormLabel>
                                                <RadioGroup
                                                    defaultValue="stand"
                                                    aria-labelledby="demo-customized-radios"
                                                    name="customized-radios"
                                                    sx={{
                                                        '& span.Mui-checked span': {
                                                            backgroundColor: `${green[600]}!important`
                                                        }
                                                    }}
                                                >
                                                    <FormControlLabel value="all" control={<BpRadio />} label="Tất cả" />
                                                    <FormControlLabel value="stand" control={<BpRadio />} label="Đã tạo" />
                                                    <FormControlLabel value="convert" control={<BpRadio />} label="Đã thanh toán" />
                                                    <FormControlLabel value="value3" control={<BpRadio />} label="Đã giao hàng" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="admin-page__length">
                                            <FormControl>
                                                <FormLabel id="demo-customized-radios" className = 'admin-page__custom'>
                                                    <span>Sắp xếp theo</span>
                                                </FormLabel>
                                                <RadioGroup
                                                    defaultValue="oneYear"
                                                    aria-labelledby="demo-customized-radios"
                                                    name="customized-radios"
                                                    sx={{
                                                        '& span.Mui-checked span': {
                                                            backgroundColor: `${green[600]}!important`
                                                        }
                                                    }}
                                                >
                                                    <FormControlLabel value="sad" control={<BpRadio />} label="Mặc định" />
                                                    <FormControlLabel value="oneYear" control={<BpRadio />} label="Từ thấp đến cao" />
                                                    <FormControlLabel value="threeYears" control={<BpRadio />} label="Từ cao xuống thấp" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div className="admin-page__checkout">
                                    <div className="admin-page__title">
                            Loại hình thanh toán
                                    </div>
                                    <div className="admin-page__checkout--content">
                                        <FormControl sx={{ m: 1, minWidth: 220 }}>
                                            <Select
                                                value={age}
                                                onChange={handleChange}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                sx={{
                                                    height: 50,
                                                    '&:hover fieldset, &.Mui-focused fieldset': {
                                                        borderColor: `${green[600]}!important`
                                                    }
                                                }}
                                            >
                                                <MenuItem value={10}>Ether</MenuItem>
                                                <MenuItem value={20} disabled>ECO Coin (Upcoming)</MenuItem>
                                                <MenuItem value={30} disabled>VISA (Upcoming)</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button variant="contained" disableElevation
                                            sx={{
                                                background: `${green[600]}!important`
                                            }}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                        {/* Tạm thời render ở đây */}
                        <Box
                            sx={{
                                width: '100%',
                                pt: 4,
                                borderTop: `1px solid ${grey[200]}`
                            }}
                        >
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: green[600]
                                }}
                            >
                                Sản phẩm của bạn ({postedItems.length})
                            </Typography>
                        </Box>
                        <div className="admin-page__list">
                            {
                                postedItems?.sort((a, b) => a.created_at > b.created_at).map((item) => (
                                    <Box key={item.id}
                                        elevation={0}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
                                            boxSizing: 'border-box',
                                            borderRadius: 1,
                                            border: item.state === 0
                                                ? '2px solid #0288d1' : item.state === 2
                                                    ? '2px solid #43a047' : '2px solid #f44336',
                                            p: 2,
                                            color: item.state === 2 ? grey[400] : 'inherit'
                                        }}
                                    >
                                        <Typography sx={{ textTransform: 'uppercase' }}>
                                            {item.identify}
                                        </Typography>
                                        <Typography>
                                            Giá: {item.price} wei
                                        </Typography>
                                        <Typography>
                                            Danh mục: {item.category}
                                        </Typography>
                                        <Typography>
                                            Trạng thái: {convertState(item.state)}
                                        </Typography>
                                        <Typography>
                                            Item address: {item.itemAddress}
                                        </Typography>
                                        {
                                            item.state == 1 && <Button variant="outlined" color="warning" sx={{ mt: 1 }}
                                                onClick={() => handleTriggerPayment(item)}
                                            >
                                    Giao hàng
                                            </Button>
                                        }
                                        {
                                            item.state === 2 && <Typography sx={{ color: green[600], fontWeight: 600, fontSize: 20 }}>
                                    Đã giao hàng
                                            </Typography>
                                        }
                                    </Box>
                                ))
                            }
                        </div>
                    </>
            }
        </motion.div>
    );
}

export default AdminPage;