import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {getTodayWeather, getGeolocationWeather, cancelWeather} from 'api/open-weather-map';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';

import Today from './Today';
import { Footer } from  './StaticComponent';
import './App.css';
import './Theme.css';

export class App extends React.Component {
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
            ...App.getInitWeatherState(), 
            unit: 'metric',
            navbarToggle: false,
            currentLocation: 'naCL',
            loading: true,
            masking: true,
        };

        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleFormQuery = this.handleFormQuery.bind(this);
        this.handleGetGeolocationWeather = this.handleGetGeolocationWeather.bind(this);
        this.handleCloseWeatherError = this.handleCloseWeatherError.bind(this);
        this.handleShowWeatherError = this.handleShowWeatherError.bind(this);
        this.handleGetGeolocationWeather = this.handleGetGeolocationWeather.bind(this);
    };

    render() {
        return (
            <Router>
                <div className={`app-navbar bg-faded ${this.state.group}`}>
                    <Navbar variant="dark">
                        <div className="container">
                            <Navbar.Brand className="navbar-brand">Weather Forecast</Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbar-content"/>
                            <Navbar.Collapse id="navbar-content">
                                <Nav className="me-auto">
                                    <Nav.Link as={Link} className='app-nav-link' eventKey="home" to="/">Home</Nav.Link>
                                    <Nav.Link as={Link} className='app-nav-link' eventKey="forecast" to="/forecast">Forecast</Nav.Link>
                                </Nav>
                                <span className="navbar-text ml-auto">Ian Khor</span>
                            </Navbar.Collapse>
                        </div>
                    </Navbar>
                </div>
                <div className="weather-body">
                    <Switch>
                        <Route exact path="/">
                            <Today 
                                {...this.state}
                                showGetWeatherError={this.state.showGetWeatherError}
                                handleFormQuery={this.handleFormQuery}
                                handleGetGeolocationWeather={this.handleGetGeolocationWeather}
                            />
                        </Route>
                        <Route path="/forecast">
                            Forecast
                        </Route>
                    </Switch>
                </div>
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
                <Footer />
            </Router>
        )
    }

    handleUnitChange(unit) {
        this.setState({
            unit: unit,
        })
    }

    componentDidMount() {
        this.getGeolocationWeather(this.state.unit);
    }

    componentWillUnmount() {
        this.state.loading && cancelWeather();
    }

    getGeolocationWeather(unit) {
        this.setState({
            loading: true,
            masking: true,
        }, () => {
            console.log("Geolocation weather")
            window.navigator.geolocation.getCurrentPosition(
                (returnPosition) => {
                    let lat = returnPosition.coords.latitude;
                    let lon = returnPosition.coords.longitude;

                    getGeolocationWeather(lat, lon, unit).then((weather) => {
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
                    setWeatherInformations(null, unit, error, (this.state.city==='na')?'Hsinchu':this.state.city )
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
                ...App.getInitWeatherState(unit),
                loading: false,
            }, () => {
                this.notifyUnitChange(unit);
                this.getWeather( city?city:this.state.currentLocation , this.state.unit);
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

    handleGetGeolocationWeather(unit) {
        this.getGeolocationWeather(unit);
    }

    notifyUnitChange(unit) {
        (this.state.units !== unit) &&
            this.handleUnitChange(unit);    
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
