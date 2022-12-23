import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, LinearProgress, Stack } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { green } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import NotificationDialog from 'components/NotificationDialog';
import getWeb3 from 'getWeb3';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.scss';


const ExpandMore = styled((props) => {
    // eslint-disable-next-line no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));


function TokenPage() {
    const [account, setAccount] = useState('');
    const [userTokens, setUserToken] = useState(0);
    const [targetBudget, setTargetBudget] = useState('1');
    const [paypalAmount, setPaypalAmount] = useState(1);
    const [loading, setLoading] = useState(true);
    const tokenRef = useRef();
    const tokenSaleRef = useRef();
    const itemManagerRef = useRef();
    const kycRef = useRef();
    const web3Ref = useRef();
    const history = useHistory();
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

    const initLoad = async () => {
        try {
            const { account, web3, tokenInstance, tokenSaleInstance, kycInstance, itemManager } = await getWeb3();
            tokenRef.current = tokenInstance;
            tokenSaleRef.current = tokenSaleInstance;
            itemManagerRef.current = itemManager;
            kycRef.current = kycInstance;
            web3Ref.current = web3;
            setAccount(account);
        } catch (err) {
            handleShowDialog();
        }
    };

    useEffect(() => {
        initLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [expanded1, setExpanded1] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [expanded3, setExpanded3] = useState(false);

    const handleExpandClick1 = () => {
        setExpanded1(!expanded1);
    };
    const handleExpandClick2 = () => {
        setExpanded2(!expanded2);
    };
    const handleExpandClick3 = () => {
        setExpanded3(!expanded3);
    };

    window.ethereum.on('accountsChanged', function (accounts) {
        checkKycWhiteList();
        setAccount(accounts[0]);
        checkKycWhiteList();
    });

    const checkKycWhiteList = async () => {
        try {
            const isValidAccount = await kycRef.current.methods.kycCompleted(account).call();
            if (!isValidAccount) {
                history.push('/kyc');
            }
            setLoading(false);
        } catch (err) {
            handleShowDialog();
        }
    };

    useEffect(() => {
        if (tokenRef.current) {
            getUserToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenRef, account]);

    useEffect(() => {
        if (kycRef.current && account) {
            checkKycWhiteList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kycRef.current, account]);

    const getUserToken = async () => {
        try {
            const tokenCount = await tokenRef.current.methods.balanceOf(account).call();
            // eslint-disable-next-line no-console
            console.log('tokenCount', tokenCount);
            if (tokenCount) {
                setUserToken(tokenCount);
            }
        } catch (err) {
            handleShowDialog();
        }
    };

    const handleBuyToken = async () => {
        if (targetBudget && tokenSaleRef.current?.methods) {
            await tokenSaleRef.current?.methods
                .buyTokens(account)
                .send({ from: account, value: web3Ref.current.utils.toWei(targetBudget, 'wei') });
            getUserToken();
        }
    };

    const handleBuyTokenPaypal = async () => {
        if (targetBudget && tokenSaleRef.current?.methods) {
            await tokenSaleRef.current.methods
                .buyTokensPaypal(account, targetBudget).send({ from: account });
            getUserToken();
        }
    };

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setTargetBudget(e.target.value);
        if (value == '1') {
            setPaypalAmount(1);
            return;
        }
        if (value == '10') {
            setPaypalAmount(9);
            return;
        }
        if (value == '100') {
            setPaypalAmount(85);
            return;
        }
    };

    const [{ options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: 'USD'
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paypalAmount]);

    useEffect(() => {
        if (tokenRef.current && tokenSaleRef.current && kycRef.current && web3Ref.current) {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenRef.current && tokenSaleRef.current && kycRef.current && web3Ref.current]);

    if (loading) {
        return <Stack width="100%"><LinearProgress/></Stack>;
    }

    return (
        <div className="welcome-page">
            <div className="welcome-page__container">
                <div className="welcome-page__direction">
                    <h4>Chào mừng đến với Eco Market</h4>
                    <h1>Hãy đổi ECOMK Token để bắt đầu mua sắm nào</h1>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">Tỷ lệ quy đổi như thế nào?</div>
                            <ExpandMore
                                expand={expanded1}
                                onClick={handleExpandClick1}
                                aria-expanded={expanded1}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </div>
                        <Collapse in={expanded1} timeout="auto" unmountOnExit>
                            <Typography paragraph>
                                Hiện tại, tỷ lệ quy đổi của ECOMK Token đang ở mức 1USD / 1 Token. Tỷ lệ này có thể thay đổi trong tương lai.
                            </Typography>
                        </Collapse>
                    </div>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">Có thể đổi ngược lại từ Token sang USD không?</div>
                            <ExpandMore
                                expand={expanded2}
                                onClick={handleExpandClick2}
                                aria-expanded={expanded2}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </div>
                        <Collapse in={expanded2} timeout="auto" unmountOnExit>
                            <Typography paragraph>
                                Hoàn toàn có thể. Tuy nhiên tính năng này vẫn đang phát triển và chưa khả dụng tại phiên bản tại.
                            </Typography>

                        </Collapse>
                    </div>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">
                                Tôi có thể dùng ECOMK Token để trao đổi sang các loại token khác hay không?
                            </div>
                            <ExpandMore
                                expand={expanded3}
                                onClick={handleExpandClick3}
                                aria-expanded={expanded3}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </div>
                        <Collapse in={expanded3} timeout="auto" unmountOnExit>
                            <Typography paragraph>
                                ECOMK Token chỉ có thể sử dụng để trao đổi, mua bán trong ECO Market, không thể quy đổi sang các loại token khác.
                            </Typography>

                        </Collapse>
                    </div>
                </div>
                <div className="welcome-page__options">
                    <Stack sx={{ width: '100%' }} flexDirection="row" justifyContent="flex-start">
                        <Typography textAlign="left">
                            Số token hiện tại của bạn: {userTokens} ECOMK
                        </Typography>
                    </Stack>
                    <FormControl sx={{ width: '100%' }}>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={targetBudget}
                            onClick={handleRadioChange}
                        >
                            <div className="welcome-page__options--select">
                                <FormControlLabel value="1" control={<Radio />} label=""/>
                                <div className="welcome-page__options--text">
                                    <h4>1 ECOMK Token</h4>
                                    <p>Nhận 1 điểm tích lũy</p>
                                </div>
                                <div className="welcome-page__options--price">$1 USD / 1 wei</div>
                            </div>
                            <div className="welcome-page__options--select">
                                <FormControlLabel value="10" control={<Radio /> } label=""/>
                                <div className="welcome-page__options--text">
                                    <h4>10 ECOMK Token</h4>
                                    <p>Tiết kiệm hơn 10%. Nhận 11 điểm tích lũy</p>
                                </div>
                                <div className="welcome-page__options--price">$9 USD / 10 wei</div>
                            </div>
                            <div className="welcome-page__options--select">
                                <FormControlLabel value="100" control={<Radio />} label=""/>
                                <div className="welcome-page__options--text">
                                    <h4>100 ECOMK Token</h4>
                                    <p>Tiết kiệm hơn 15%. Nhận 120 điểm tích lũy</p>
                                </div>
                                <div className="welcome-page__options--price">$85 USD / 100 wei</div>
                            </div>
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{ width: '100%' }}>
                        <Button variant='contained' disableElevation onClick={handleBuyToken}
                            sx={{
                                width: '100%',
                                height: 45,
                                bgcolor: green[600],
                                '&:hover': {
                                    bgcolor: green[800]
                                }
                            }}
                        >Thanh toán bằng Ether</Button>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        '& div': {
                            width: '100%'
                        }
                    }}>
                        <PayPalButtons
                            style={{ layout: 'horizontal' }}
                            disabled={false}
                            createOrder={(data, actions) => {
                                return actions.order
                                    .create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    currency_code: 'USD',
                                                    value: paypalAmount
                                                }
                                            }
                                        ]
                                    })
                                    .then((orderId) => {
                                        // Your code here after create the order
                                        return orderId;
                                    });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then(function () {
                                    handleBuyTokenPaypal();

                                });
                            }}
                            onError={() => {
                                handleShowDialog();
                            }}
                        />
                    </Box>
                </div>
            </div>
            {showDialog && (
                <NotificationDialog
                    showDialog={showDialog}
                    handleDialogClose={handleDialogClose}
                    handleAcceptDialog={handleAcceptDialog}
                />
            )}
        </div>
    );
}

export default TokenPage;