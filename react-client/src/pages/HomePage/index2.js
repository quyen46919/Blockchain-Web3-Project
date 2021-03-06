import { Close, Search } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, IconButton, Slider } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { green, grey } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/system';
import axios from 'axios';
import CardItem from 'components/CardItem';
import { AuthContext } from 'context/AuthContext';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Web3 from 'web3';
import './styles2.scss';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,

        '&.Mui-selected': {
            outline: 0
        }
    },
    gap: 6
}));

const StyledToggleButton = styled(ToggleButton)(() => ({
    borderRadius: '20px!important',
    textTransform: 'initial',
    outline: `1px solid ${grey[400]}`,
    height: 36,
    padding: '0 0.8rem'
}));

export const marks = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 2,
        label: '2'
    },
    {
        value: 4,
        label: '4'
    },
    {
        value: 6,
        label: '6'
    },
    {
        value: 8,
        label: '8'
    },
    {
        value: 10,
        label: '10...'
    }
];

function HomePage2() {
    // const [category, setState] = useState({
    //     'Hàng tiêu dùng': true,
    //     'Thực phẩm': true,
    //     'Đồ công nghệ': false,
    //     'Khác': true
    // });
    const [category, setCategory] = useState('');
    const [alignment, setAlignment] = useState('left');
    const [select, setSelect] = useState(0);
    const [showDetail, setShowDetail] = useState(false);
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(0);
    const [items, setItems] = useState([]);
    const [initialItems, setInitialItems] = useState([]);
    const [targetItem, setTargetItem] = useState();
    const { dispatch, shoppingCart } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchAllItem = async () => {
            try {
                const params = {
                    category: category
                };
                for (const key of Object.keys(params)) {
                    if (params[key] === '') {
                        delete params[key];
                    }
                }
                console.log(params);
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/items/`, { params });
                console.log(res.data);
                setItems(res.data);
                setInitialItems(res.data);
            } catch (err) {
                enqueueSnackbar('Có lỗi xảy ra, vui lòng thử F5 trình duyệt của bạn!', {
                    variant: 'error'
                });
            }
        };
        fetchAllItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    useEffect(() => {
        if (startPrice !== 0 && endPrice !== 0) {
            const newItemsList = items.filter(
                (item) => parseFloat(Web3.utils.fromWei(item.price.toString(), 'ether')) >= startPrice
                && parseFloat(Web3.utils.fromWei(item.price.toString(), 'ether')) <= endPrice
            );
            setItems(newItemsList);
        } else {
            setItems(initialItems);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startPrice, endPrice]);

    const handlePriceChange = (event, newValue) => {
        setStartPrice(newValue[0]);
        setEndPrice(newValue[1]);
    };

    const handleStartPriceChange = (e) => {
        setStartPrice(parseInt(e.target.value));
    };

    const handleEndPriceChange = (e) => {
        setEndPrice(parseInt(e.target.value));
    };

    const handleSelectChange = (event) => {
        setSelect(event.target.value);
    };

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleChange = (name) => {
        setCategory(name);
    };

    const handleShowDetailPanel = (item) => {
        setShowDetail(true);
        setTargetItem(item);
    };

    const handleAddItemToCart = () => {
        dispatch({ type: 'ADD_TO_CART', payload: targetItem });
    };

    const handleFilterItem = () => {
        setCategory('');
        setStartPrice(0);
        setEndPrice(0);
    };

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className='homepage2'>
            <div className="homepage2__filter-panel">
                <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
                    <p className='homepage2__label-title'>Danh mục</p>
                    <FormGroup sx={{ width: '100%' }}>
                        {
                            Array.from(['', 'Hàng tiêu dùng', 'Thực phẩm', 'Đồ công nghệ', 'Khác']).map((name, index) => (
                                <FormControlLabel
                                    key={name}
                                    control={
                                        <Checkbox
                                            checked={name === category}
                                            onChange={() => handleChange(name)}
                                            name="category"
                                            sx={{
                                                color: '#878691',
                                                '& svg': {
                                                    fontSize: 24,
                                                    color: grey[400]
                                                },
                                                '&.Mui-checked svg': {
                                                    color: `${green[600]}!important`
                                                }
                                            }}
                                        />
                                    }
                                    sx={{
                                        m: 0,
                                        'span': {
                                            fontSize: 16,
                                            color: grey[800]
                                        }
                                    }}
                                    label={name === '' ? 'Tất cả': name}
                                />
                            ))
                        }
                    </FormGroup>
                </FormControl>
                <div className="homepage2__line-column">
                    <p className='homepage2__label-title'>Giá</p>
                    <div>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            step={1}
                            valueLabelDisplay="auto"
                            marks={marks}
                            min={0}
                            max={10}
                            onChange={handlePriceChange}
                            value={[startPrice, endPrice]}
                            sx={{ color: green[600] }}
                        />
                        <div>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                <p className="homepage2__normal-label">Từ</p>
                                <OutlinedInput
                                    name="number"
                                    type="number"
                                    id="formatted-numberformat-input"
                                    value={startPrice}
                                    onChange={handleStartPriceChange}
                                    endAdornment={<InputAdornment position="end">ether</InputAdornment>}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                <p className="homepage2__normal-label">Đến</p>
                                <OutlinedInput
                                    name="number"
                                    type="number"
                                    id="formatted-numberformat-input"
                                    value={endPrice}
                                    onChange={handleEndPriceChange}
                                    endAdornment={<InputAdornment position="end">ether</InputAdornment>}
                                    size="small"
                                />
                            </Box>
                        </div>
                    </div>
                    <Button variant="contained" fullWidth disableElevation
                        sx={{
                            background: `${green[600]}!important`,
                            textTransform: 'initial'
                        }}
                        onClick={handleFilterItem}
                    >
                        Xóa lựa chọn
                    </Button>
                </div>
                {/* <div className='homepage2__rating'>
                    <p className='homepage2__label-title'>Bình chọn</p>
                    <Rating name="size-large" defaultValue={2} size="large" />
                </div> */}
            </div>
            <div className={showDetail ? 'homepage2__content open' : 'homepage2__content'}>
                <FormControl
                    sx={{
                        mt: 1,
                        mb: 1,
                        width: {
                            xs: 600
                        },
                        outline: 'none!important',
                        '& *': {
                            border: 'none'
                        }
                    }}
                >
                    <OutlinedInput
                        type="search"
                        startAdornment={
                            <InputAdornment
                                position="start"
                                sx={{ 'svg': { color: grey[600] } }}
                            >
                                <Search/>
                            </InputAdornment>
                        }
                        sx={{
                            borderRadius: '20px',
                            backgroundColor: '#FAFAFA',
                            color: grey[600]
                        }}
                        spellCheck="false"
                        onChange={handleSearchTextChange}
                    />
                </FormControl>
                <div className="homepage2__filter-row">
                    <p>Sắp xếp theo:</p>
                    <div style={{ width: '20px' }}/>
                    <StyledToggleButtonGroup
                        size="small"
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                    >
                        <StyledToggleButton value="left" className="homepage2__filter-row--btn">
                            Tất cả
                        </StyledToggleButton>
                        <StyledToggleButton value="center" className="homepage2__filter-row--btn">
                            Mới đăng
                        </StyledToggleButton>
                        <StyledToggleButton value="right" className="homepage2__filter-row--btn">
                            Giá tốt
                        </StyledToggleButton>
                    </StyledToggleButtonGroup>
                    <FormControl sx={{ ml: 1 }}>
                        <Select
                            value={select}
                            onChange={handleSelectChange}
                            sx={{
                                height: 40,
                                borderRadius: 10,
                                textTransform: 'initial!important',
                                fontSize: 14,
                                fontWeight: 400,
                                border: `px solid ${grey[300]}`,
                                color: grey[600],
                                '&:hover fieldset, &.Mui-focused fieldset': {
                                    borderColor: `${green[600]}!important`
                                }
                            }}
                        >
                            <MenuItem
                                value={0}
                                sx={{
                                    fontSize: 14,
                                    color: grey[600]
                                }}
                            >mặc định</MenuItem>
                            <MenuItem
                                value={10}
                                sx={{
                                    fontSize: 14,
                                    color: grey[600]
                                }}
                            >Giá cao đến thấp</MenuItem>
                            <MenuItem
                                value={20}
                                sx={{
                                    fontSize: 14,
                                    color: grey[600]
                                }}
                            >Giá thấp đến cao</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="homepage2__list-item">
                    {
                        items.filter((item) => item.identify.includes(searchText)).map((item, index) => (
                            <CardItem key={index} handleShowDetailPanel={handleShowDetailPanel} item={item}/>
                        ))
                    }
                </div>
                {/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant='outlined'
                        sx={{
                            padding: '0.4rem 2rem',
                            margin: '1rem 0',
                            borderRadius: 3,
                            color: green[600],
                            borderColor: `${green[600]}!important`
                        }}
                    >
                        Tải thêm
                    </Button>
                </Box> */}
            </div>
            {
                showDetail && <div className="homepage2__detail-panel">
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: 0
                        }}
                        onClick={() => setShowDetail(false)}
                    >
                        <Close/>
                    </IconButton>
                    <div className="homepage2__detail-panel__img">
                        <img src={targetItem.images[0]} alt="item card image"/>
                    </div>
                    <div className="homepage2__detail-panel__others-img">
                        {
                            targetItem.images.map((img, index) => (
                                <img src={img} key={index} alt="item card image"/>
                            ))
                        }
                    </div>
                    <div className="homepage2__detail-panel__title">
                        {targetItem.identify}
                    </div>
                    <div className="homepage2__list-text">
                        <p>Giá</p>
                        {targetItem.price} wei
                    </div>
                    <div className="homepage2__list-text">
                        <p>Mô tả sản phẩm</p>
                        {targetItem.description}
                    </div>
                    <div className="homepage2__list-text">
                        <p>Đăng tải vào</p>
                        {targetItem.created_at}
                    </div>
                    <div className="homepage2__detail-panel__bottom">
                        <IconButton sx={{ backgroundColor: '#FFF1F2!important', borderRadius: 2 }}>
                            <FavoriteIcon fontSize='small' sx={{ color: '#FD6B6C' }} />
                        </IconButton>
                        <Button
                            variant="outlined"
                            sx={{
                                width: '100%',
                                backgroundColor: `${green[600]}!important`,
                                color: 'white!important',
                                textTransform: 'initial',
                                border: 'none!important',
                                borderRadius: 3
                            }}
                            onClick={handleAddItemToCart}
                        >
                            { shoppingCart.find((item) => item.id === targetItem.id) ? 'Đi tới giỏ hàng': 'Thêm vào giỏ hàng' }
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default HomePage2;