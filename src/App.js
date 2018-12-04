import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from 'qs';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      authorSearch: "",
      authorWorks: []
    })
  }

  componentDidMount() {

    // this is the second acios call to GoodReads API - getting the book ID
    axios({
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://www.goodreads.com/book/show',
        params: {
          key: 'dRJuutBqKWVrrJUND8jbmQ',
          id: 77566
        },
        proxyHeaders: {
          'header_params': 'value'
        },
        xmlToJSON: true
      }
    }).then(res => {
      console.log(res);
    });
  }

  // handling on change input - updating our state of authorSearch
  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://www.goodreads.com/search/index.xml',
        params: {
          q: this.state.authorSearch,
          key: 'dRJuutBqKWVrrJUND8jbmQ'
        },
        proxyHeaders: {
          'header_params': 'value'
        },
        xmlToJSON: true
      }
    }).then(res => {
      // filter results to get just an array of author's works, from which we will get all other data
      this.setState({
        authorWorks: res.data.GoodreadsResponse.search.results.work
      })
      console.log("this is authorWorks",this.state.authorWorks);
    });
  }

  render() {
    return (
      <div className="App">
        <h1>When You Peaked</h1>
        <p> Welcome to Sabrehawk & Baggins</p>
        <form onSubmit={this.handleSubmit} action="">
          <label htmlFor="text">Enter Author Name: </label>
          <input onChange={this.handleChange} value={this.state.authorSearch} type="text" id="authorSearch" />
          <input type="submit" value="search" id="#" />
        </form>
      </div>
    );
  };
}

  export default App;
