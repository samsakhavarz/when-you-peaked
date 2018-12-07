import React, { Component } from 'react';
import {Chart} from "react-charts";
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

class Plot extends Component{
    render(){
        return(
            <div>
                <div className="chartContainer">
                    <Chart data={
                        {
                            label: "average rating per movie per year",
                            data: this.props.data
                        }
                        }
                        series={{
                            showPoints: false,
                        }}
                        axes={[
                            {
                                primary: true,
                                type: "linear",
                                position: "bottom"
                            },
                            { type: "linear", position: "left" }
                        ]}
                        tooltip
                    />
                </div>
            </div>
        )
    }
}

export default Plot;