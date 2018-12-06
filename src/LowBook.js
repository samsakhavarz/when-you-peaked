import React from 'react';

const LowBook = (props) => {
    console.log(props);
    return (
        <div>
            <div>Put book image here</div>
            {/* <p>Title: {lowBook.title} </p> */}
            <p>Year(written or published?): </p>
            <p>Average Rating: </p>
        </div>
    )
    
}


export default LowBook;