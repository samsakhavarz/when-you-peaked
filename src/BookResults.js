import React, { Component } from 'react';
import { Link, withRouter, Redirect} from 'react-router-dom';
import './App.css';
import Chart from "./Chart.js";
import axios from "axios";
import Qs from 'qs';

const scrollToElement = require('scroll-to-element');
scrollToElement('#id');

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
            activeOne: false,
            activeTwo: false,
            activeThree: false,
            activeFour: false
        })
    }   

    componentDidMount() {
        this.getData(this.props.authorSubmit);
        // scrollToElement('.card', {
        //     offset: -200,
        //     ease: 'outCube',
        //     duration: 2000
        // });
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

            scrollToElement('.card', {
                offset: -200,
                ease: 'outCube',
                duration: 2000
            });
            
            // array of 20 works by searched author
            const works = res.data.GoodreadsResponse.search.results.work  
            
            // handle refreshes in chrome!!
            // if (works === undefined) {
            //     //history.push("/");
            //     <Redirect to={{pathname:"/"}} />
            // }
            
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

    // a dynamic function for ALL handle clicks using e.target.id to update state
    onClick = (e) => {
        console.log(this.state[e.target.id]);
        
        this.setState({
            [e.target.id]: !(this.state[e.target.id])
        })  
    }

    // error handling for Chrome ?????
    // onUnload() {

    // }

    render() {      
        return(           
            <div className="wrapper resultContainer clearfix"> 
                <h2>Highest vs. Lowest Rated</h2>     
                <div className="bookHero borderAccent">
                    <h3>Highest Rated</h3>

                    <div className={(this.state.activeOne) ? 'flipper' : 'noFlipper'}>
                        <div className="card">
                            <div className="front face">          
                                <div className="bookStats">
                                    <h4>{`${this.state.highBook.title}`}</h4> 

                                    <p> Year: <span>{`${this.state.highBook.year}`}</span></p>
                                    <p> Average Rating: <span>{`${this.state.highBook.avgRating}`}</span></p>
                                    <p> Number of Star Rating: <span>{`${this.state.highBook.starRatingCount}`}</span></p>
                                    <p>Number of Text Reviews: <span>{`${this.state.highBook.textReviewCount}`}</span></p>     
                                </div>

                                <div className="talkScoreContainer clearfix">
                                    <div className="talkScore" onClick={this.onClick} id="activeThree" value={this.state.activeThree}>
                                        <p>{`${this.state.highBook.talkScore}`}</p>
                                        <i className="fas fa-question"></i>
                                    </div>
                                </div>

                                <p className={(this.state.activeThree) ? "show description" : "hidden description"}>How much are readers discussing this book? This is the ratio of text reviews to starred ratings, multiplied by one hundred.</p>

                                <button className="descriptionButton" id="activeOne" onClick={this.onClick}>Description</button>
                            </div>

                            <div onClick={this.onClick} className={(this.state.activeOne) ? 'noFlipper back face center' : 'flipper back face center'}>
                                    <h4>Description: </h4>
                                    <p className="description" dangerouslySetInnerHTML={{ __html: this.state.highBook.description}}></p> 
                                    <button className="returnButton" id="activeOne" onClick={this.onClick}>Return</button>    
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOW BOOK */}
                <div className="bookHero borderAccent">
                    <h3>Lowest Rated</h3>
                    <div className={(this.state.activeTwo) ? 'flipper' : 'noFlipper'}>
                        <div className="card">
                            <div className="front face">
                                <div className="bookStats">
                                    <h4>{`${this.state.lowBook.title}`}</h4>

                                    <p> Year: <span>{`${this.state.lowBook.year}`}</span></p>
                                    <p> Average Rating: <span>{`${this.state.lowBook.avgRating}`}</span></p>
                                    <p> Number of Star Rating: <span>{`${this.state.lowBook.starRatingCount}`}</span></p>
                                    <p>Number of Text Reviews: <span>{`${this.state.lowBook.textReviewCount}`}</span></p>  
                                </div>
                                <div className="talkScoreContainer clearfix">
                                    <div className={"talkScore"} onClick={this.onClick} id="activeFour">
                                        <p>{`${this.state.lowBook.talkScore}`}</p>
                                        <i className="fas fa-question"></i>
                                    </div>
                                </div>

                                <p className={(this.state.activeFour) ? "show description" : "hidden description"}>How much are readers discussing this book? This is the ratio of text reviews to starred ratings, multiplied by one hundred.</p>

                                <button className="descriptionButton" id="activeTwo" onClick={this.onClick}>Description</button>
                            </div>

                             <div className={(this.state.activeTwo) ? 'noFlipper back face center' : 'flipper back face center'} onClick={this.onClickTwo}>
                                <h4>Description: </h4>
                                <p className="description" dangerouslySetInnerHTML={{ __html: this.state.lowBook.description }}></p>
                                <button className="returnButton" id="activeTwo" onClick={this.onClick}>Return</button>
                            </div>
                        </div> 
                    </div>
                </div> 
                        
                <div className="chartContainer">
                    <Chart years={this.state.yearsArray} ratings={this.state.ratingsArray} />
                </div>

                
                <Link to={"/"} className="button">Search again?</Link>
           
                                 
            </div>
        )
    }
}
export default withRouter(BookResults);