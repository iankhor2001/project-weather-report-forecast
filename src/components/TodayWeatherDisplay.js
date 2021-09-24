import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

import './TodayWeatherDisplay.css';

export default class TodayWeatherDisplay extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string,
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="container mb-5">
                <Card>
                    <Stack direction="horizontal" className="py-3">
                        <div className="me-auto ms-5">
                            <Card.Header className="pt-3 pb-0 weather-display-header">
                                <h3>
                                    Weather in {this.props.city}, {this.props.country}
                                </h3>
                                <h5 className="weather-display-subheader">
                                    As of {this.props.requestTime}
                                </h5>
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <div className={`weather-display ${this.props.masking ? 'masking' : ''}`}>
                                    <h1 className='temp'>
                                        <span className='display-1'>{this.props.temp.toFixed(1)}&ordm;</span>
                                        &nbsp;
                                        {(this.props.unit === 'metric') ? 'C' : 'F'}
                                    </h1>
                                    <h5 className='description'>{this.props.description}</h5>
                                </div>
                            </Card.Body>
                        </div>
                        <img className='h-100 me-5' src={require(`images/w-${this.props.group}.png`).default}/>
                    </Stack>    
                </Card>
                
            </div>
            
        )
    }
}