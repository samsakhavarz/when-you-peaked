import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import './App.css';

class Form extends Component {
    
    render() {
        return (
// taking in the handlesubmit from parent app.js, using a callback function to pass back in the history
            <form onSubmit={(e)=> this.props.handleSubmit(e, this.props.history)} action="">
                <label htmlFor="text">Enter Author Name: </label>
                <input className="searchField" onChange={this.props.handleChange} value={this.props.authorSearch} type="text" id="authorSearch" placeholder="author name" required />
                <input className="button" type="submit" value="SEARCH" id="#" />
            </form>
        )
    }

}

//using withrouter to export the form with history
export default withRouter(Form);