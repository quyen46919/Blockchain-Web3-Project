import { Box, Button, OutlinedInput, Stack, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import getWeb3 from 'getWeb3';
import MyToken from 'contracts/MyToken.json';
import MyTokenSale from 'contracts/MyTokenSale.json';
import KycContract from 'contracts/KycContract.json';

function KYCRegisterPage() {
    const [tokenIns, setTokenInstance] = useState();
    const [tokenSaleInstance, setTokenSaleInstance] = useState();
    const [kycInstance, setKycInstance] = useState();
    const [account, setAccount] = useState('');
    const [kyc, setKyc] = useState('');
    const [tokenSaleAddress, setTokenSaleAddress] = useState('');
    const [userToken, setUserToken] = useState(0);
    const [web3Ins, setWeb3Ins] = useState();
    const [validAccount, setValidAccount] = useState(false);

    useEffect(() => {
        const initLoad = async () => {
            try {
                const web3 = await getWeb3();
                const account = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const tokenInstance = new web3.eth.Contract(
                    MyToken.abi,
                    MyToken.networks[networkId] && MyToken.networks[networkId].address
                );
                const tokenSaleInstance = new web3.eth.Contract(
                    MyTokenSale.abi,
                    MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address
                );
                const kycInstance = new web3.eth.Contract(
                    KycContract.abi,
                    KycContract.networks[networkId] && KycContract.networks[networkId].address
                );
                setAccount(account[0]);
                setTokenInstance(tokenInstance);
                setTokenSaleInstance(tokenSaleInstance);
                setKycInstance(kycInstance);
                setTokenSaleAddress(MyTokenSale.networks[networkId].address);
                setWeb3Ins(web3);
            } catch (err) {
                console.log(err);
            }
        };
        initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tokenIns && tokenSaleInstance && kycInstance && account) {
            getUserToken();
            checkKycWhiteList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenIns, tokenSaleInstance, kycInstance, account]);

    window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0]);
    });


    // const listenTokenTransfer = async () => {
    //     tokenIns.events.Transfer({ to: account }).on('data', getUserToken);
    // };

    const checkKycWhiteList = async () => {
        const isValidAccount = await kycInstance.methods.kycCompleted(account).call();
        setValidAccount(isValidAccount);
    };

    const getUserToken = async () => {
        const tokenCount = await tokenIns.methods.balanceOf(account).call();
        if (tokenCount) {
            setUserToken(tokenCount);
        }
    };


    const handleFormSubmit = async () => {
        try {
            await kycInstance.methods.setKycCompleted(kyc).send({ from: account });
            checkKycWhiteList();
            alert(`KYC for ${kyc} is saved`);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setKyc(e.target.value);
    };

    const handleBuyToken = async () => {
        await tokenSaleInstance.methods.buyTokens(account)
            .send({ from: account, value: web3Ins.utils.toWei('1', 'wei') });
        getUserToken();
    };

    return (
        <Box width="100%" p="20px 30px" boxSizing="border-box">
            {
                validAccount
                    ? <Typography>Tài khoản của bạn đã được xác thực</Typography>
                    : <>
                        <Typography>Tài khoản của bạn chưa được xác thực, hãy đăng ký KYC</Typography>
                        <form>
                            <OutlinedInput
                                placeholder="Nhập address ví của bạn"
                                variant="standard"
                                spellCheck="false"
                                type="text"
                                onChange={handleChange}
                                name="kycAddress"
                                fullWidth
                                sx={{
                                    mt: 2, mb: 2,
                                    '& .MuiInput-underline:after': { borderColor: green[600] },
                                    '&.Mui-focused fieldset': { borderColor: `${green[600]}!important` }
                                }}
                            />
                            <Stack flexDirection="row" gap={1}>
                                <Button variant="contained" onClick={handleFormSubmit}>Đăng ký</Button>
                            </Stack>
                        </form>
                    </>
            }

            <Stack mt={3} gap={1}>
                <Typography>Nếu bạn muốn mua token, hãy chuyển ether vào address: {tokenSaleAddress}</Typography>
                <Typography>Số token hiện tại của bạn: {userToken} ECOMK</Typography>
                <Button variant="contained" onClick={handleBuyToken} sx={{ width: 'fit-content' }}>Mua token</Button>
            </Stack>
        </Box>
    );
}

export default KYCRegisterPage;