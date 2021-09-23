import React from 'react';
import {getTodayWeather, getGeolocationWeather, cancelWeather} from 'api/open-weather-map';
import Modal from 'react-bootstrap/Modal';

import TodayWeatherDisplay, { ShowGetWeatherError } from './TodayWeatherDisplay';
import TodayWeatherForm from './TodayWeatherForm';
import Button from 'react-bootstrap/Button';

export default class Today extends React.Component {
    static getInitWeatherState() { 
        return {
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            temp: NaN,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Today.getInitWeatherState(),
            currentLocation: 'naCL',
            loading: true,
            masking: true,
            showGetWeatherError: false,
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);
        this.handleCloseWeatherError = this.handleCloseWeatherError.bind(this);
        this.handleShowWeatherError = this.handleShowWeatherError.bind(this);
    }

    render() {
        return (
            <div className={`today weather-bg ${this.state.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <TodayWeatherDisplay {...this.state}/>
                    <TodayWeatherForm 
                        city={this.state.city} 
                        unit={this.props.unit} 
                        onQuery={this.handleFormQuery}
                        getGeoWeather={this.getGeolocationWeather}
                    />
                    <Button onClick={() => this.getGeolocationWeather(this.props.unit)}>Get Current Location Weather</Button>   {/*Show Weather at my current location */}
                    
                    <Modal 
                        show={this.state.showGetWeatherError} 
                        onHide={this.handleCloseWeatherError}
                    >
                        <div className={'bg-danger text-white text-center border border-light rounded'}>
                            <Modal.Header closeButton>
                                <Modal.Title>Error retrieving weather!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Error getting weather<br/>Displaying default location
                            </Modal.Body>
                        </div>
                        
                    </Modal>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getGeolocationWeather(this.props.unit)
    }

    componentWillUnmount() {
        this.state.loading && cancelWeather();
    }

    getGeolocationWeather(unit) {
        this.setState({
            loading: true,
            masking: true,
        }, () => {
            window.navigator.geolocation.getCurrentPosition(
                (returnPosition) => {
                    let lat = returnPosition.coords.latitude;
                    let lon = returnPosition.coords.longitude;

                    getGeolocationWeather(lat, lon, this.props.unit).then((weather) => {
                        console.log('Received Geolocation Weather Information');
                        this.setWeatherInformations(weather, unit);
                    }).catch(err => {
                        console.error('Error getting weather, displaying default location\n', err);
                        this.handleShowWeatherError();
                        this.setWeatherInformations(null, unit, err, 'Hsinchu');
                    });
                },
                (error) => {
                    console.log('Error getting weather, displaying default location\n', error);
                    this.handleShowWeatherError();
                    setWeatherInformations(weather, unit, error, (this.state.city==='na')?'Hsinchu':this.state.city )
                },
            );
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    getWeather(city, unit) { 
        console.log('Getting Weather from '+ String(city));
        this.setState({
            loading: true,
            masking: true,
            city: city
        }, () => {
            getTodayWeather(city, unit).then(weather => {
                console.log('Received Information');
                this.setWeatherInformations(weather, unit);
            }).catch(err => {
                console.error('Error getting weather, displaying default location\n', err);
                this.handleShowWeatherError();
                this.setWeatherInformations(null, unit, err);
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    setWeatherInformations(weather, unit, err=null, city=null) {
        if (err) {
            this.setState({
                ...Today.getInitWeatherState(unit),
                loading: false,
            }, () => {
                this.notifyUnitChange(unit);
                this.getWeather( city?city:this.state.currentLocation , this.props.unit);
            });
        } else {
            console.log(weather);
            this.setState({
                ...weather,
                loading: false,
            }, () => this.notifyUnitChange(unit));
        }
        
    }

    handleFormQuery(city, unit) {
        this.getWeather(city, unit);
    }

    notifyUnitChange(unit) {
        (this.props.units !== unit) &&
            this.props.onUnitChange(unit);    
    }

    handleShowWeatherError() {
        this.setState({
            showGetWeatherError: true
        })
    }

    handleCloseWeatherError() {
        this.setState({
            showGetWeatherError: false
        })
    }
}
