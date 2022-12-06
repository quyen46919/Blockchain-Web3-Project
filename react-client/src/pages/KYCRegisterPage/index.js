import { Box, Button, OutlinedInput, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import getWeb3 from 'getWeb3';
import MyToken from 'contracts/MyToken.json';
import MyTokenSale from 'contracts/MyTokenSale.json';
import KycContract from 'contracts/KycContract.json';

function KYCRegisterPage() {
    const [tokenInstance, setTokenInstance] = useState();
    const [tokenSaleInstance, setTokenSaleInstance] = useState();
    const [kycInstance, setKycContract] = useState();
    const [account, setAccount] = useState('');
    const [kyc, setKyc] = useState('');

    useEffect(() => {
        const initLoad = async () => {
            try {
                const web3 = await getWeb3();
                const account = await web3.eth.getAccounts();
                console.log(account);
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
            } catch (err) {
                console.log(err);
                alert('Something went wrong!');
            }
        };
        initLoad();
    }, []);


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
        </Box>
    );
}

export default KYCRegisterPage;