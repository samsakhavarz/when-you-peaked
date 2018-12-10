import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import './App.scss';
import axios from "axios";
import Qs from 'qs';
import BookResults from './BookResults.js';
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
          <div className="wrapper">
            <header className="mainHeader">
              <h1 className="title animated flipInX delay-1s">VERSVS</h1>
              <p class="introCopy">Compare your favourite author's highest and lowest rated books. See where they peaked and plunged throughout their literary career.</p>
              <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} authorSearch={this.state.authorSearch} /> 
            </header>
          
          </div>


            <div className="wrapper">
              <Route path="/bookresults" render={() => 
              <BookResults authorSubmit={this.state.authorSubmit} />} />       
            </div>                           

          <footer>
            <p className="corpTitle">SabreHawk <span>&</span> Baggins est. 2018</p>
          </footer>
        </div>
      </Router>
    );
  };
}

export default App;