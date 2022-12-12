import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import './styles.scss';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));
function WelcomePage() {
    const [expanded1, setExpanded1] = React.useState(false);

    const [expanded2, setExpanded2] = React.useState(false);

    const [expanded3, setExpanded3] = React.useState(false);

    const handleExpandClick1 = () => {
        setExpanded1(!expanded1);
    };
    const handleExpandClick2 = () => {
        setExpanded2(!expanded2);
    };
    const handleExpandClick3 = () => {
        setExpanded3(!expanded3);
    };
    const checkFunc = () => {
        if (FormControlLabel.propTypes.checked.isRequired == true) {
            console.log('ádasdsad');
        }
    };
    return (
        <div className="welcome-page">
            <div className="welcome-page__container">
                <div className="welcome-page__direction">
                    <h4>Welcome to Eco Market</h4>
                    <h1>Select your Margick plan</h1>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">So how does the 14-Day free trial work?</div>
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
                                    Add rice and stir very gently to distribute. Top with artichokes and
                                    peppers, and cook without stirring, until most of the liquid is absorbed,
                            </Typography>
                        </Collapse>
                    </div>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">Why do you need my credit card for the free trial?</div>
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
                                    Add rice and stir very gently to distribute. Top with artichokes and
                                    peppers, and cook without stirring, until most of the liquid is absorbed,
                            </Typography>

                        </Collapse>
                    </div>
                    <div className="welcome-page__direction--cover">
                        <div className="welcome-page__direction--collapse">
                            <div className="welcome-page__direction--title">How do I cancel if I im not super impressed? </div>
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
                                    Add rice and stir very gently to distribute. Top with artichokes and
                                    peppers, and cook without stirring, until most of the liquid is absorbed,  Top with artichokes and
                                    peppers, and cook without stirring, until most of the liquid is absorbed, Top with artichokes and
                                    peppers, and cook without stirring, until most of the liquid is absorbed,
                            </Typography>

                        </Collapse>
                    </div>
                </div>
                <div className="welcome-page__options">
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="started"
                            name="radio-buttons-group"
                        >
                            <div className="welcome-page__options--select">
                                <FormControlLabel value="started" control={<Radio />} label="" />
                                <div className="welcome-page__options--text">
                                    <h4>Started</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti tenetur, obca Deleniti tenetur, obca Deleniti tenetur, obca</p>
                                </div>
                                <div className="welcome-page__options--price">$ 37/mo.</div>
                            </div>
                            <div className="welcome-page__options--select">
                                <FormControlLabel onClick={checkFunc} value="standard" control={<Radio /> } label="" />
                                <div className="welcome-page__options--text">
                                    <h4>Standard</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti tenetur, obca</p>
                                </div>
                                <div className="welcome-page__options--price">$ 77/mo.</div>
                            </div><div className="welcome-page__options--select">
                                <FormControlLabel
                                    onClick={checkFunc} value="pro" control={<Radio />} label="" />
                                <div className="welcome-page__options--text">
                                    <h4>Pro</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
                                </div>
                                <div className="welcome-page__options--price">$ 150/mo.</div>
                            </div>
                        </RadioGroup>
                    </FormControl>
                    <Button>Login</Button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;