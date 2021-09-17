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
import './App.css';

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
                <div className={`main bg-faded ${this.state.group}`}>
                    <Navbar bg="light">
                        <div className="container">
                            <Navbar.Brand className="navbar-brand">Weather Forecast</Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbar-content"/>
                            <Navbar.Collapse id="navbar-content">
                                <Nav className="me-auto">
                                    <Nav.Link as={Link} eventKey="home" to="/">Home</Nav.Link>
                                    <Nav.Link as={Link} eventKey="forecast" to="/forecast">Forecast</Nav.Link>
                                </Nav>
                                <span className="navbar-text ml-auto">Ian Khor</span>
                            </Navbar.Collapse>
                        </div>
                    </Navbar>
                </div>
                <Switch>
                    <Route exact path="/">
                        <Today unit={this.state.unit} onUnitChange={this.handleUnitChange} />
                    </Route>
                    <Route path="/forecast">
                        Forecast
                    </Route>
                </Switch>
                
            </Router>
        )
    }

    handleUnitChange(unit) {
        this.setState({
            unit: unit,
        })
    }
}