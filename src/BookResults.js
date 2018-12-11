import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Chart from "./Chart.js";
import axios from "axios";
import Qs from 'qs';


class BookResults extends Component {
    constructor() {
        super();
        this.state = ({
            sortedByAvg: [],
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
            },
            active: false
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
            // array of 20 works by searched author
            const works = res.data.GoodreadsResponse.search.results.work
            
            // filter out any element in works that does not contain a valid publication year in two new arrays
            const sortedByAvg = works.filter(work => work.original_publication_year.hasOwnProperty("$t"));

            const sortedByYear = works.filter(work => work.original_publication_year.hasOwnProperty("$t"));
                               
            sortedByAvg.sort((a,b) => {
                let comparison = 0;

                if (a.average_rating > b.average_rating ) {
                    comparison = 1;
                } else if (a.average_rating < b.average_rating) {
                    comparison = -1;
                }
                return comparison
            })

            sortedByYear.sort((a, b) => {
                let comparison = 0;

                if (a.original_publication_year["$t"] > b.original_publication_year["$t"]) {
                    comparison = 1;
                } else if (a.original_publication_year["$t"] < b.original_publication_year["$t"]) {
                    comparison = -1;
                }
                return comparison
            })
                    
            // initialize array of JUST years...
            const years = sortedByYear.map(book => {
                return book.original_publication_year["$t"]
            })
            
            // ...and an array of JUST avg ratings to pass to the Chart
            const avgRatings = sortedByYear.map(book => {
                return book.average_rating
            })
            
            //set state with sorted array and chart data
            this.setState({
                sortedByAvg: sortedByAvg,
                yearsArray: years,
                ratingsArray: avgRatings
                }
            )
            
            // set state from API info. take the lowest (first) and highest (last) rated books
            this.setState(
                {
                    highBook: {
                        id: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.id["$t"],
                        title: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.title,
                        year: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].original_publication_year["$t"],
                        avgRating: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].average_rating,
                        cover: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.img_url
                    },
                    lowBook: {
                        id: this.state.sortedByAvg[0].best_book.id["$t"],
                        title: this.state.sortedByAvg[0].best_book.title,
                        year: this.state.sortedByAvg[0].original_publication_year["$t"],
                        avgRating: this.state.sortedByAvg[0].average_rating,
                        cover: this.state.sortedByAvg[0].best_book.img_url
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
                        id: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.id["$t"],
                        title: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.title,
                        year: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].original_publication_year["$t"],
                        avgRating: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].average_rating,
                        cover: this.state.sortedByAvg[this.state.sortedByAvg.length - 1].best_book.img_url,
                        url: link,
                        description: desc,
                        starRatingCount: ratings,
                        textReviewCount: reviews,
                        talkScore: talkScore
                    }
                }) :
                this.setState({
                    lowBook: {
                        id: this.state.sortedByAvg[0].best_book.id["$t"],
                        title: this.state.sortedByAvg[0].best_book.title,
                        year: this.state.sortedByAvg[0].original_publication_year["$t"],
                        avgRating: this.state.sortedByAvg[0].average_rating,
                        cover: this.state.sortedByAvg[0].best_book.img_url,
                        url: link,
                        description: desc,
                        starRatingCount: ratings,
                        textReviewCount: reviews,
                        talkScore: talkScore
                    }
                })
        })
    }

   onClick = (e) => {
       this.setState({ 
           active: !this.state.active
        });
        console.log(this.state.active);
    }

    render() {      
        return(           
            <div className="resultContainer clearfix"> 
                         
                <div className="bookHero highNovel borderAccent">
                    <h2>HIGHEST RATED</h2>
                    <div className={(this.state.active) ? 'flipper' : 'noFlipper'}>
                    <div className="card">
                        <div className="front face" onClick={this.onClick}>
                                <h3>{`${this.state.highBook.title}`}</h3>           
                                <div className="bookStats">
                                    <p> Year: {`${this.state.highBook.year}`}</p>
                                    <p> Average Rating: {`${this.state.highBook.avgRating}`}</p>
                                    <p> Number of Star Rating: {`${this.state.highBook.starRatingCount}`}</p>
                                    <p>Number of Text Reviews: {`${this.state.highBook.textReviewCount}`}</p>                 
                                </div>
                                <div className="talkScore">
                                    <p>Talk Score: {`${this.state.highBook.talkScore}`}</p>
                                </div>
                            </div>

                            <div onClick={this.onClick} className={(this.state.active) ? 'noFlipper back face center' : 'flipper back face center'}>
                                <h3>Description: </h3>
                                <p dangerouslySetInnerHTML={{ __html: this.state.highBook.description}}></p>    
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* LOW BOOK */}
                    <div className="bookHero highNovel borderAccent">
                        <h2>LOWEST RATED</h2>
                        <div className="card">
                            <div className="front face">
                                <h3>{`${this.state.lowBook.title}`}</h3>
                                <div className="bookStats">
                                    <p>Year: {`${this.state.lowBook.year}`}</p>
                                    <p>Average Rating: {`${this.state.lowBook.avgRating}`}</p>
                                    <p>Number of Star Rating: {`${this.state.lowBook.starRatingCount}`}</p>
                                    <p>Number of Text Reviews: {`${this.state.lowBook.textReviewCount}`}</p>
                                </div>
                                <div className="talkScore">
                                    <p>Talk Score: {`${this.state.lowBook.talkScore}`}</p>
                                </div>                   
                            </div>  
                            <div className="back face center">
                                <h3>Description: </h3>
                                <p dangerouslySetInnerHTML={{ __html: this.state.lowBook.description }}></p>
                            </div>
                        </div> 
                    </div> 

                    <div className="borderAccent">
                        <h2 className="chartTitle">WHEN THEY PEAKED</h2>
                        <div className="chartContainer">
                            <Chart years={this.state.yearsArray} ratings={this.state.ratingsArray} />
                        </div>
                    </div>

                <div className="button">
                        <Link to={"/"} className="searchAgain">SEARCH AGAIN</Link>
                </div>
                                
            </div>
        )
    }
}
export default BookResults;