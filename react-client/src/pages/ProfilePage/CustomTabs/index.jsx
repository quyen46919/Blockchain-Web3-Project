
import { AppBar, Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import ChangeAvatar from '../ChangeAvatar';
import { makeStyles } from '@mui/styles';
import './styles.scss';
import EditInfo from '../editInfo';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        flexGrow: 1,
        boxShadow: 'none!important'
    },
    tabs: {
        boxSizing: 'border-box',
        padding: '0 1.5rem'
    },
    tab: {
        width: '120px!important',
        minWidth: '120px!important',
        textTransform: 'unset!important',
        fontSize: '1rem',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    box: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center!important',
        padding: '20px 0'
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} className={classes.box}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`
    };
}

export default function CustomTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={`${classes.root} custom-tabs`}>
            <AppBar position="static" className={classes.tabs} color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab className={classes.tab} label="Thông tin cá nhân" {...a11yProps(0)} />
                    <Tab className={classes.tab} label="Đổi ảnh đại diện" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <EditInfo/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ChangeAvatar/>
            </TabPanel>
        </div>
    );
}
