import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from 'qs';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      authorSearch: "",
      authorWorks: [],
    })
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
          key: 'dRJuutBqKWVrrJUND8jbmQ',
          searchauthor: "author",
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
      });
      // sorts the array and makes a new one with just two books
      const sortedWorks = this.state.authorWorks.sort((a, b) => {
          return a.average_rating - b.average_rating
        });
      console.log("this is sortedWorks", sortedWorks);

       // axios({
      //   url: 'http://proxy.hackeryou.com',
      //   dataResponse: 'json',
      //   paramsSerializer: function (params) {
      //     return Qs.stringify(params, { arrayFormat: 'brackets' })
      //   },
      //   params: {
      //     reqUrl: `https://www.goodreads.com/author/list.xml`,
      //     params: {
      //       key: 'dRJuutBqKWVrrJUND8jbmQ',
      //       page: 1,
      //       id: this.state.authorID
      //     },
      //     proxyHeaders: {
      //       'header_params': 'value'
      //     },
      //     xmlToJSON: true
      //   }
      // }).then( res => {
      //   this.setState({
      //     authorWorks: res
      //   })
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
