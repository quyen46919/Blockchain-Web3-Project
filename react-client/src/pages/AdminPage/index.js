import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import './styles.scss';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MenuItem from '@mui/material/MenuItem';
import { motion } from 'framer-motion/dist/framer-motion';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
    theme.palette.mode === 'dark'
        ? '0 0 0 1px rgb(16 22 26 / 40%)'
        : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
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
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <motion.div
            exit={{ opacity: 0 }}
            initial = {{ y: -60, opacity: 0 }}
            animate = {{ y: 0, opacity: 1 }}
            transition = {{ delay: .2 }}
            className="admin-page">
            <div className="admin-page__savings">
                <h3>Yearly Savings</h3>
                <span>Upload March 25/01/2022 12:20 am</span>
                <div className="admin-page__totals">
                    <div className="admin-page__element">
                        <p>Total possible savings</p>
                        <h2 className='admin-page__possible'>$37,109.61</h2>
                    </div>
                    <div className="admin-page__element">
                        <p>Selected savings (12 months)</p>
                        <h2>$37,109.61</h2>
                    </div>
                    <div className="admin-page__element"></div>
                    <div className="admin-page__element">
                        <p>Total cost</p>
                        <h2>$37,109.61</h2>
                    </div>
                </div>
            </div>
            <div className="admin-page__items">
                <h3>Your Items (29)</h3>
                <div className="admin-page__row">
                    <div className="admin-page__project">
                        <div className="admin-page__title">
                            projected spend
                        </div>
                        <div className="admin-page__project--content">
                            <p>All</p>
                            <h3>$543,543.45</h3>
                            <p>With Recommendations</p>
                            <h3>$123,324.4</h3>
                        </div>
                    </div>
                    <div className="admin-page__instances">
                        <div className="admin-page__title">
                            reserved instances
                        </div>
                        <div className="admin-page__instances--content">
                            <div className="admin-page__type">
                                <FormControl>
                                    <FormLabel id="demo-customized-radios">Type</FormLabel>
                                    <RadioGroup
                                        defaultValue="no"
                                        aria-labelledby="demo-customized-radios"
                                        name="customized-radios"
                                    >
                                        <FormControlLabel value="no" control={<BpRadio />} label="No Upfront" />
                                        <FormControlLabel value="partial" control={<BpRadio />} label="Partial Upfront" />
                                        <FormControlLabel value="all" control={<BpRadio />} label="All Upfront" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className="admin-page__length">
                                <FormControl>
                                    <FormLabel id="demo-customized-radios" className = 'admin-page__custom'>
                                        <span>Length</span>
                                        <DragIndicatorIcon/>
                                    </FormLabel>
                                    <RadioGroup
                                        defaultValue="oneYear"
                                        aria-labelledby="demo-customized-radios"
                                        name="customized-radios"
                                    >
                                        <FormControlLabel value="oneYear" control={<BpRadio />} label="12 Months" />
                                        <FormControlLabel value="threeYears" control={<BpRadio />} label="36 Months" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className="admin-page__offering">
                                <FormControl>
                                    <FormLabel id="demo-customized-radios" className = 'admin-page__custom'>
                                        <span>Offering Class</span>
                                        <DragIndicatorIcon/>
                                    </FormLabel>
                                    <RadioGroup
                                        defaultValue="stand"
                                        aria-labelledby="demo-customized-radios"
                                        name="customized-radios"
                                    >
                                        <FormControlLabel value="stand" control={<BpRadio />} label="Standard" />
                                        <FormControlLabel value="convert" control={<BpRadio />} label="Convertable" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="admin-page__checkout">
                        <div className="admin-page__title">
                            checkout
                        </div>
                        <div className="admin-page__checkout--content">
                            <h3>Method</h3>
                            <FormControl sx={{ m: 1, minWidth: 220 }}>
                                <Select
                                    value={age}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="">
                                    </MenuItem>
                                    <MenuItem value={10}>123213213213213214</MenuItem>
                                    <MenuItem value={20}>342342346t23423423</MenuItem>
                                    <MenuItem value={30}>432423423423432432</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" disableElevation>
                            Disable elevation
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default AdminPage;