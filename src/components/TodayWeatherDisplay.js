import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
                                        <span className='display-1'>
                                            {this.props.temp.toFixed(1)}&ordm;
                                            {(this.props.unit === 'metric') ? 'C' : 'F'}
                                        </span>
                                    </h1>
                                    <h5 className='description'>{this.props.description}</h5>
                                </div>
                            </Card.Body>
                        </div>
                        <img className='h-100 me-5' src={require(`images/w-${this.props.group}.png`).default} />
                    </Stack>    
                </Card>
                <Card className='mt-2'>
                    <Card.Header className='weather-display-header pt-3 ms-5'>
                        <h3>Further Details</h3>
                    </Card.Header>
                    <Card.Body className='mx-5 pt-0'>
                        <Row>
                            <WeatherDisplayCol title="Sunrise"      icon="sunrise"  infoUnit=""     value={this.props.furtherCurrentInfo.sunrise}/>
                            <WeatherDisplayCol title="Sunset"       icon="sunset"  infoUnit=""     value={this.props.furtherCurrentInfo.sunset}/>
                            <WeatherDisplayCol title="Feels Like"   icon="thermometer"  infoUnit={(this.props.unit === 'metric') ? '\xBAC' : '\xBAF'}
                                value={this.props.furtherCurrentInfo.feelsLike} />
                            <WeatherDisplayCol title="Pressure"     icon="barometer"  infoUnit="hPa"  value={this.props.furtherCurrentInfo.pressure}/>
                            <WeatherDisplayCol title="Humidity"     icon="humidity"  infoUnit="%"    value={this.props.furtherCurrentInfo.humidity}/>
                            <WeatherDisplayCol title="Dew Point"    icon="raindrops"  infoUnit={(this.props.unit === 'metric') ? '\xBAC' : '\xBAF'} 
                                value={this.props.furtherCurrentInfo.dewPoint} />
                            <WeatherDisplayCol title="Cloudiness"   icon="cloudy"  infoUnit="%"    value={this.props.furtherCurrentInfo.clouds}/>
                            <WeatherDisplayCol title="UV Index"     icon="day-sunny"  infoUnit=""     value={this.props.furtherCurrentInfo.uvi}/>
                            <WeatherDisplayCol title="Visibility"   icon="smog"  infoUnit="m"    value={this.props.furtherCurrentInfo.visibility}/>
                            {/* Wind speed + deg */}
                            <Col sm={6} as='h5' className="px-2 my-2">
                                <div className="d-flex">
                                    <i className={`wi wi-fw wi-strong-wind wi-custom`}></i>
                                    <div className="ms-1 me-auto">Wind</div>
                                    <div className="ms-1 ms-auto">
                                        <i className={`wi wi-custom wi-fw wi-wind towards-${this.props.furtherCurrentInfo.windDeg}-deg`}></i>
                                        {this.props.furtherCurrentInfo.windSpeed} {(this.props.unit === 'metric') ? 'm/s' : 'mph'}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            
        )
    }
}

function WeatherDisplayCol(props) {
    return (
        <Col sm={6} as='h5' className="px-2 my-2">
            <div className="d-flex">
                <i className={`wi wi-fw wi-${props.icon} wi-custom`}></i>
                <div className="ms-1 me-auto">{props.title}</div>
                <div className="ms-1 ms-auto">{props.value} {props.infoUnit}</div>
            </div>
        </Col>
    );
}