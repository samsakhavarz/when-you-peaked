import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import axios from "axios";
import Qs from 'qs';

class BookResults extends Component {
    constructor() {
        super();
        this.state = ({
            sortedWorks: [],
            highBook: {
                id: 0,
                title: "",
                year: 0,
                description: "",
                avgRating: 0,
                cover: "",
                url: ""
            },
            lowBook: {
                id: 0,
                title: "",
                year: 0,
                description: "",
                avgRating: 0,
                cover: "",
                url: ""
            }
        })
    }

    componentDidMount(){
        console.log("am i working?");
        axios({
            url: 'http://proxy.hackeryou.com',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: 'https://www.goodreads.com/search/index.xml',
                params: {
                    q: this.props.authorSearch,
                    key: 'dRJuutBqKWVrrJUND8jbmQ',
                    search: "author",
                },
                proxyHeaders: {
                    'header_params': 'value'
                },
                xmlToJSON: true
            }
        }).then(res => {

            const authorWorks = res.data.GoodreadsResponse.search.results.work

            // sorts the array by average rating
            const sorted = authorWorks.sort((a, b) => {
                return a.average_rating - b.average_rating
            });

            // take the lowest (first) and highest (last) rated books and set state
            this.setState({
                sortedWorks: sorted,
            })

            // set state from API info
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

            // pass highBook and lowBook to getDescAndUrl for more info
            this.getDescAndUrl(this.state.highBook);
            this.getDescAndUrl(this.state.lowBook);
        })

    }
// method to get description and url from a different API request, called by handleSubmit
    getDescAndUrl = (book) => {

        // NEXT AXIOS TEST: find book description and url using id we got from other call
        axios({
            url: 'https://proxy.hackeryou.com',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: `https://www.goodreads.com/book/show/${book.id}.xml`,
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
            // console.log("original res:", res);

            const desc = res.data.GoodreadsResponse.book["description"]
            const link = res.data.GoodreadsResponse.book.url

            // if the book we pass to getDescAndUrl is highBook, then set the whole state of highBook, else set the state of lowBook
            // CAN WE DO THIS ANOTHER WAY????
            book === this.state.highBook ?
                this.setState({
                    highBook: {
                        id: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.id["$t"],
                        title: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.title,
                        year: this.state.sortedWorks[this.state.sortedWorks.length - 1].original_publication_year["$t"],
                        avgRating: this.state.sortedWorks[this.state.sortedWorks.length - 1].average_rating,
                        cover: this.state.sortedWorks[this.state.sortedWorks.length - 1].best_book.img_url,
                        url: link,
                        description: desc
                    }
                }) :
                this.setState({
                    lowBook: {
                        id: this.state.sortedWorks[0].best_book.id["$t"],
                        title: this.state.sortedWorks[0].best_book.title,
                        year: this.state.sortedWorks[0].original_publication_year["$t"],
                        avgRating: this.state.sortedWorks[0].average_rating,
                        cover: this.state.sortedWorks[0].best_book.img_url,
                        url: link,
                        description: desc
                    }
                })
        })
    }

    render() {
        console.log(this.props.authorSearch)
        return(
            <div>
                <p>{`${this.state.highBook.description}`}</p>
                <p>HELLO?</p>
            </div>

        )
    }

}

export default BookResults;