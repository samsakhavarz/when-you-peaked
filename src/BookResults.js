import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Chart from "./Chart.js";
import axios from "axios";
import Qs from 'qs';
import MDSpinner from "react-md-spinner";

class BookResults extends Component {
    constructor() {
        super();
        this.state = ({
            sortedWorks: [],
            yearsArray: [],
            ratingsArray:[],
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
        axios({
            url: 'http://proxy.hackeryou.com',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: `https://www.goodreads.com/search?q=${author}&search[field]=author&format=xml&key=dRJuutBqKWVrrJUND8jbmQ`,
                params: {
                    q: author,
                    key: 'dRJuutBqKWVrrJUND8jbmQ',
                    //search: "author",
                },
                proxyHeaders: {
                    'header_params': 'value'
                },
                xmlToJSON: true
            }
        }).then(res => {            
            const authorWorks = res.data.GoodreadsResponse.search.results.work
            console.log("this is authorWorks",authorWorks);
            
            // sorts the array by average rating
            const sorted = authorWorks.sort((a, b) => {
                return a.average_rating - b.average_rating
            });

            // // create an array of arrays to plot our data points in Chart, starting with x axis
            // const years = authorWorks.filter((index) => {
            //     return [index.original_publication_year["$t"]]
            // })

            // // and average rating on the y axis
            // const avgRatings = authorWorks.map((index) => {
            //     return [index.average_rating]
            // })

            // initialize arrays for books with defined publication year and average rating
            const years = [];
            const avgRatings = [];

            // filter out the indecies in authorWorks with undefined years and add the book to arrays
            for (let i = 0; i < authorWorks.length; i++) {
                // authorWorks[i].original_publication_year != "undefined" ?
                // years.push(authorWorks[i].original_publication_year["$t"]) &&
                // avgRatings.push(authorWorks[i].average_rating)
                // :
                // null
                if (typeof (authorWorks[i].original_publication_year) !== undefined) {
                    years.push(authorWorks[i].original_publication_year["$t"]) &&
                        avgRatings.push(authorWorks[i].average_rating)
                }
            }

            console.log("this is years", years);
            console.log("this is avgRatings", avgRatings);

            //set state with sorted array and chart data
            this.setState({
                sortedWorks: sorted,
                yearsArray: years,
                ratingsArray: avgRatings
                }
            )
            
            // set state from API info. take the lowest (first) and highest (last) rated books
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
   
    render() {       
        console.log(this.props.authorSubmit)

        return(
            
            <div className="resultContainer clearfix">
                
                <div className="highBook bookHero">
                    <h2>{`${this.state.highBook.title}`}</h2>

                <div>

                    {/* <p>{`${this.state.highBook.description}`}</p> */}
                    <div className="bookStats">
                        <p> Year: {`${this.state.highBook.year}`}</p>
                        <p> Average Rating: {`${this.state.highBook.avgRating}`}</p>
                        <p> Number of Star Rating: {`${this.state.highBook.starRatingCount}`}</p>
                        <p className="bookStat">Number of Text Reviews: {`${this.state.highBook.textReviewCount}`}</p>                 
                    </div>
                    <div className="talkScore">
                        <p>Talk Score: {`${this.state.highBook.talkScore}`}</p>
                    </div>
                    <div className="description">
                        <h3>Description: </h3>
                        <p dangerouslySetInnerHTML={{ __html: this.state.highBook.description}}></p>         
                    </div>
                    <Chart years={this.state.yearsArray} ratings={this.state.ratingsArray}/>
                </div>

                <div className="lowBook bookHero">

                    <h2>{`${this.state.lowBook.title}`}</h2>
                    <div className="bookStats">
                        <p>Year: {`${this.state.lowBook.year}`}</p>
                        <p>Average Rating: {`${this.state.lowBook.avgRating}`}</p>
                        <p>Number of Star Rating: {`${this.state.lowBook.starRatingCount}`}</p>
                        <p>Number of Text Reviews: {`${this.state.lowBook.textReviewCount}`}</p>         
                    </div>
                    <div className="talkScore">
                        <p>Talk Score: {`${this.state.lowBook.talkScore}`}</p>                  
                    </div>
                    <div className="description">
                        <h3>Description: </h3>
                        <p dangerouslySetInnerHTML={{ __html: this.state.lowBook.description }}></p>
                    </div>
                </div>

                
            </div>


            
               

        )
    }
}
export default BookResults;