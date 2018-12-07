import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import axios from "axios";
import Qs from 'qs';
import BookResults from './BookResults.js';
import Chart from './Chart.js';
import Form from './Form.js';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      authorSearch: "",
      authorSubmit: ""
    })
  }

  // handling on change input - updating our state of authorSearch
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

//handlesubmit now takes 2 parameters, the event and history
  handleSubmit = (e, history) => {
    e.preventDefault();
    history.push("/bookresults");
    this.setState({
     authorSubmit: this.state.authorSearch
    })
 
  }

  render() {
    return (
      <Router>
        <div className="App">
        <header>
          <h1>When You Peaked</h1>
          <p> Welcome to Sabrehawk & Baggins</p>
          <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} authorSearch={this.state.authorSearch} /> 
        </header>
        <Route path="/bookresults" render={() => 
            <BookResults authorSubmit={this.state.authorSubmit} />} />
        </div>
      </Router>
    );
  };
}

  export default App;
