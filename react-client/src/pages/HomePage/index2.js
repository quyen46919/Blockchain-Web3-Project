import { Search } from '@mui/icons-material';
import { Button, Card, Rating, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/system';
import CardItem from 'components/CardItem';
import React from 'react';
import { useState } from 'react';
import './styles2.scss';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius
        }
    }
}));

function HomePage2() {
    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: false
    });
    const { gilad, jason, antoine } = state;
    const [alignment, setAlignment] = React.useState('left');
    const [age, setAge] = React.useState(10);
    const [showDetail, setShowDetail] = useState(false);

    const handleSelectChange = (event) => {
        setAge(event.target.value);
    };

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked
        });
    };

    const handleShowDetailPanel = () => {
        setShowDetail(!showDetail);
    };

    return (
        <div className='homepage2'>
            <div className="homepage2__filter-panel">
                <p>Filter</p>
                <Box sx={{ display: 'flex' }}>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Category</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
                                }
                                label="Gilad Gray"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={jason} onChange={handleChange} name="jason" />
                                }
                                label="Jason Killian"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={antoine}
                                        onChange={handleChange}
                                        name="antoine"
                                    />
                                }
                                label="Antoine Llorca"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
                <div className="homepage2__line-column">
                    <FormLabel component="div">Price Range</FormLabel>
                    <div className="homepage2__price-range">
                        <TextField variant="outlined" type="number"/>
                        -
                        <TextField variant="outlined" type="number"/>
                    </div>
                    <Button variant="contained" fullWidth disableElevation>
                        Contained
                    </Button>
                </div>
                <div>
                    <FormLabel component="div">Rating</FormLabel>
                    <Rating name="size-large" defaultValue={2} size="large" />
                </div>
            </div>
            <div className={showDetail ? 'homepage2__content open' : 'homepage2__content'}>
                <FormControl sx={{ m: 1, width: '400px' }}>
                    <OutlinedInput
                        type="text"
                        startAdornment={
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <span>This is search text</span>
                <div className="homepage2__filter-row">
                    <p>Sort by</p>
                    <div style={{ width: '20px' }}/>
                    <StyledToggleButtonGroup
                        size="small"
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="left" className="homepage2__filter-row--btn">
                            Tất cả
                        </ToggleButton>
                        <ToggleButton value="center" className="homepage2__filter-row--btn">
                            Giá rẻ
                        </ToggleButton>
                        <ToggleButton value="right" className="homepage2__filter-row--btn">
                            Tiện nghi
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                    <FormControl>
                        <Select
                            defaultValue="ASC"
                            value={age}
                            onChange={handleSelectChange}
                            className="homepage2__filter-row--select"
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="homepage2__list-item">
                    {
                        Array.from(new Array(39)).map((item, index) => (
                            <CardItem key={index} handleShowDetailPanel={handleShowDetailPanel}/>
                        ))
                    }
                </div>
            </div>
            {
                showDetail && <div className="homepage2__detail-panel">
                    this is detail panel
                </div>
            }
        </div>
    );
}

export default HomePage2;