import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import Container from 'react-bootstrap/Container';

import Today from './Today';
import { Footer } from  './StaticComponent';
import './App.css';
import './Theme.css';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: 'metric',
            navbarToggle: false,
        };
        this.handleUnitChange = this.handleUnitChange.bind(this);
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
                            <Today unit={this.state.unit} onUnitChange={this.handleUnitChange} />
                        </Route>
                        <Route path="/forecast">
                            Forecast
                        </Route>
                    </Switch>
                </div>
                
                <Footer />
            </Router>
        )
    }

    handleUnitChange(unit) {
        this.setState({
            unit: unit,
        })
    }
}
