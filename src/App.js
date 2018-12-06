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
    console.log("working cool sweet", e, history);
    history.push("/bookresults");
  }

  render() {
    return (
      <Router>
        <div className="App">
        <header>
          <h1>When You Peaked</h1>
          <p> Welcome to Sabrehawk & Baggins</p>
        </header>
          
        
        <Route path="/" render={() => 
            <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} authorSearch={this.state.authorSearch}/> }>
        </Route>

        <Route path="/bookresults" render={() => 
            <BookResults authorSearch={this.state.authorSearch} />} />
        </div>
      </Router>
    );
  };
}

  export default App;
