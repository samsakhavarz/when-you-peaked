import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from 'qs';
import nl2br from 'react-newline-to-break';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      authorSearch: "",
      sortedWorks: [],
      highBook: {
        id: 0,
        title: "",
        year: 0,
        description: "",
        avgRating: 0,
        cover: ""
      },
      lowBook: {
        id: 0,
        title: "",
        year: 0,
        description: "",
        avgRating: 0,
        cover: ""
      }
    })
  }

  // handling on change input - updating our state of authorSearch
  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }


// the one that works
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
          search: "author",
        },
        proxyHeaders: {
          'header_params': 'value'
        },
        xmlToJSON: true
      }
    }).then(res => {
      console.log(res);
      
        const authorWorks = res.data.GoodreadsResponse.search.results.work

        // sorts the array by average rating
        const sorted = authorWorks.sort((a, b) => {
          return a.average_rating - b.average_rating
        });

        console.log("sorted:",sorted);
              
        // take the lowest (first) and highest (last) rated books and set state
        this.setState({
          sortedWorks: sorted,
        })

      this.setState(
        {
          highBook: {
            id: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.id["$t"],
            title: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.title,
            year: this.state.sortedWorks[this.state.sortedWorks.length - 1].original_publication_year["$t"],
            avgRating: this.state.sortedWorks[this.state.sortedWorks.length - 1].average_rating,
            cover: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.img_url
          },
          lowBook: {
            id: this.state.sortedWorks[0].best_book.id["$t"],
            title: this.state.sortedWorks[0].best_book.title,
            year: this.state.sortedWorks[0].original_publication_year["$t"],
            avgRating: this.state.sortedWorks[0].average_rating,
            cover: this.state.sortedWorks[0].best_book.img_url
          }
        })

      // NEXT AXIOS TEST: Book by id
      axios({
        url: 'https://proxy.hackeryou.com',
        dataResponse: 'json',
        paramsSerializer: function (params) {
          return Qs.stringify(params, { arrayFormat: 'brackets' })
        },
        params: {
          reqUrl: `https://www.goodreads.com/book/show/${this.state.highBook.id}.xml`,
          params: {
            key: 'dRJuutBqKWVrrJUND8jbmQ',
            text_only: false
          },
          proxyHeaders: {
            'header_params': 'value'
          },
          xmlToJSON: true
        }
      }).then(res => {
        // take the lowest (first) and highest (last) rated books and set state
        console.log("this is res from axios 2:", res);
      })
    })
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
