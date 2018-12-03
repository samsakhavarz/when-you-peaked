import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Qs from 'qs';

class App extends Component {
  // constructor() {
  //   super();
  //   // this.state({
  //   //   state: ''

  //   // })
  // }

  componentDidMount() {
    axios({
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://www.goodreads.com/search/index.xml',        
        params: {
          q: 'dan simmons',
          key: 'dRJuutBqKWVrrJUND8jbmQ'
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

  render() {
    return (
      <div className="App">
        <h1>When You Peaked</h1>
        <p> Welcome to Sabrehawk & Baggins</p>
      </div>
    );
  };
}

  export default App;
