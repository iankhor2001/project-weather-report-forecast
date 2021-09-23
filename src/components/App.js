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
                <div className="bg-light py-4 mt-3 fixed-bottom"> {/*  Bootstrap Footer */}
                    <footer className="py-3 border-top container d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-md-4 d-flex align-items-center">
                                <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                                    (Sym)
                                </a>
                                <span className="text-muted">2021 Ian Khor</span>
                            </div>
                            (Shadow on top edge -> texture)
                            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                                <li className="ms-3"><a className="text-muted" href="#">(Git)</a></li>
                                <li className="ms-3"><a className="text-muted" href="#">(FB)</a></li>
                            </ul>
                    </footer>
                </div>
            </Router>
        )
    }

    handleUnitChange(unit) {
        this.setState({
            unit: unit,
        })
    }
}