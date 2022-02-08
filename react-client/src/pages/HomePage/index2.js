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
import image from 'assets/images/image8.jpg';
import CardItem from 'components/CardItem';
import React, { useState } from 'react';
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
    const [category, setState] = useState({
        'Hàng tiêu dùng': false,
        'Thực phẩm': false,
        'Đồ công nghệ': false,
        'Khác': false
    });
    const [alignment, setAlignment] = useState('left');
    const [select, setSelect] = useState(0);
    const [showDetail, setShowDetail] = useState(false);
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(6);

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

    const handleChange = (event) => {
        setState({
            ...category,
            [event.target.name]: event.target.checked
        });
    };

    const handleShowDetailPanel = () => {
        setShowDetail(true);
    };

    return (
        <div className='homepage2'>
            <div className="homepage2__filter-panel">
                <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
                    <p className='homepage2__label-title'>Danh mục</p>
                    <FormGroup sx={{ width: '100%' }}>
                        {
                            Array.from(['Hàng tiêu dùng', 'Thực phẩm', 'Đồ công nghệ', 'Khác']).map((name, index) => (
                                <FormControlLabel
                                    key={name}
                                    control={
                                        <Checkbox
                                            checked={category[index]}
                                            onChange={handleChange}
                                            name={name}
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
                                    label={name}
                                />
                            ))
                        }
                    </FormGroup>
                </FormControl>
                <div className="homepage2__line-column">
                    <p className='homepage2__label-title'>Giá</p>
                    {/* <div className="homepage2__price-range">
                        <TextField variant="outlined" type="number"/>
                        -
                        <TextField variant="outlined" type="number"/>
                    </div> */}
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
                    >
                        Tìm kiếm
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
                        Array.from(new Array(11)).map((item, index) => (
                            <CardItem key={index} handleShowDetailPanel={handleShowDetailPanel}/>
                        ))
                    }
                </div>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                </Box>
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
                        <img src={image} alt="item card image"/>
                    </div>
                    <div className="homepage2__detail-panel__others-img">
                        {
                            Array.from(new Array(6)).map((img, index) => (
                                <img src={image} key={index} alt="item card image"/>
                            ))
                        }
                    </div>
                    <div className="homepage2__detail-panel__title">
                        Sản phẩm đồ gia dụng thông minh
                    </div>
                    <div className="homepage2__detail-panel__desc">
                        Day la mo ta san pham! Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe neque ipsa amet blanditiis, fugit magni ducimus cumque, incidunt veritatis dignissimos consequuntur vero dolorum eius act dolores!
                    </div>
                    {/* <div className="homepage2__detail-panel__column">
                        <div className="homepage2__detail-panel__link">
                            <NavLink to="/" exact>
                                Detail
                            </NavLink>
                            <NavLink to="" exact>
                                Reviews
                            </NavLink>
                        </div>
                        <div className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, blanditiis laboriosam! Vero tenetur voluptatem sapiente quasi aut, perferendis quisquam nam ullam, doloremque aperiam praesentium eligendi, debitis suscipit molestias sit ea.</div>
                    </div> */}
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
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default HomePage2;