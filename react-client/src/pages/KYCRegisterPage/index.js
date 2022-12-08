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
    const [kycInstance, setKycContract] = useState();
    const [account, setAccount] = useState('');
    const [kyc, setKyc] = useState('');
    const [tokenSaleAddress, setTokenSaleAddress] = useState('');
    const [userToken, setUserToken] = useState(0);

    useEffect(() => {
        const initLoad = async () => {
            try {
                const web3 = await getWeb3();
                const account = await web3.eth.getAccounts();
                console.log(account);
                console.log(web3.version);
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
                setKycContract(kycInstance);
                setTokenSaleAddress(MyTokenSale.networks[networkId].address);

                // web3.eth.call({
                //     to: MyToken.networks[networkId].address,
                //     data: account[0]
                // }).then(balance => {
                //     console.log(balance);
                // });
            } catch (err) {
                console.log(err);
                // alert('Something went wrong!');
            }
        };
        initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tokenIns && tokenSaleInstance && account) {
            console.log('tokenSaleInstance', tokenSaleInstance);
            console.log('account', account);
            getUserToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenIns, tokenSaleInstance, account]);

    const getUserToken = async () => {
        // const web3 = await getWeb3();
        // await tokenSaleInstance.setProvider(web3.eth.currentProvider);
        // await tokenSaleInstance.deployed();
        console.log('deployed');
        // await tokenIns.methods.totalSupply().call();
        await tokenSaleInstance?.methods.getTokens().call({ from: account, gas:700000 })
            .then((value) => console.log(value))
            .catch((err) => console.log(err));
    };


    const handleFormSubmit = async () => {
        try {
            console.log('call this function');
            await kycInstance.methods.setKycCompleted(kyc).send({ from: account });
            alert(`KYC for ${kyc} is saved`);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setKyc(e.target.value);
    };

    const handleBuyToken = () => {

    };

    return (
        <Box width="100%" p="20px 30px" boxSizing="border-box">
            <Typography>Đăng ký KYC</Typography>
            <form>
                <OutlinedInput
                    placeholder="Nhập KYC"
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
                <Button variant="contained" onClick={handleFormSubmit}>Đăng ký</Button>
            </form>

            <Stack mt={3} gap={1}>
                <Typography>Nếu bạn muốn mua token, hãy chuyển ether vào address: {tokenSaleAddress}</Typography>
                <Typography>Số token hiện tại của bạn: {userToken} ECO</Typography>
                <Button variant="contained" onClick={handleBuyToken} sx={{ width: 'fit-content' }}>Mua token</Button>
            </Stack>
        </Box>
    );
}

export default KYCRegisterPage;