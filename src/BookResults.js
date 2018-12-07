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
                url: "",
                starRatingCount: 0,
                textReviewCount: 0,
                talkScore: 0
            },
            lowBook: {
                id: 0,
                title: "",
                year: 0,
                description: "",
                avgRating: 0,
                cover: "",
                url: "",
                starRatingCount: 0,
                textReviewCount: 0,
                talkScore: 0
            }
        })
    }

    componentDidMount(){
        this.getData(this.props.authorSubmit);
    }

    //  first Axios call, setting
    getData = (author) => {
   
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
                    q: author,
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
       

    // if the new search is different from the old search, then make another axios call and fire the whole process again
    componentDidUpdate(prevProps){
        if (this.props.authorSubmit !== prevProps.authorSubmit) {
            this.getData(this.props.authorSubmit);
        }
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
            const ratings = res.data.GoodreadsResponse.book.ratings_count 
            const reviews = res.data.GoodreadsResponse.book.text_reviews_count 

            const talkScore = (reviews / ratings * 100).toFixed(2);

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
                        description: desc,
                        starRatingCount: ratings,
                        textReviewCount: reviews,
                        talkScore: talkScore
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
                        description: desc,
                        starRatingCount: ratings,
                        textReviewCount: reviews,
                        talkScore: talkScore
                    }
                })
        })
    }

    // calculate the talk score of each book
    // getTalkScore = () => {
    //     const talkScoreHigh = this.highBook.textReviewCount / this.highBook.starRatingCount * 100;
    //     const talkScoreLow = this.lowBook.textReviewCount / this.lowBook.starRatingCount * 100;
    // }

    render() {
        console.log(this.props.authorSubmit)
        return(
            <div>
                <div>
                    <h2>{`${this.state.highBook.title}`}</h2>
                    {/* <p>{`${this.state.highBook.description}`}</p> */}
                    <p dangerouslySetInnerHTML={{ __html: this.state.highBook.description}}></p>
                    <p> Year: {`${this.state.highBook.year}`}</p>
                    <p> Average Rating: {`${this.state.highBook.avgRating}`}</p>
                    <p> Number of Star Rating: {`${this.state.highBook.starRatingCount}`}</p>
                    <p>Number of Text Reviews: {`${this.state.highBook.textReviewCount}`}</p>
                    <p>Talk Score: {`${this.state.highBook.talkScore}`}</p>
                </div>

                <div>
                    <h2>{`${this.state.lowBook.title}`}</h2>
                    <p dangerouslySetInnerHTML={{ __html: this.state.lowBook.description }}></p>
                    <p> Year: {`${this.state.lowBook.year}`}</p>
                    <p> Average Rating: {`${this.state.lowBook.avgRating}`}</p>
                    <p> Number of Star Rating: {`${this.state.lowBook.starRatingCount}`}</p>
                    <p>Number of Text Reviews: {`${this.state.lowBook.textReviewCount}`}</p>
                    <p>Talk Score: {`${this.state.lowBook.talkScore}`}</p>
                </div>
            </div>

        )
    }

}

export default BookResults;