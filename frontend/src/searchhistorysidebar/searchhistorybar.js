import React/**, { useState }**/ from 'react';
import './searchbarhistory.css';

function SearchHistory() {
    const historyitems = ['Item 1', 'Item 2', 'Item 3']
    const favorited = ['favorited1', 'favorited2']

    return (
        <div className="container">
            <button className="caret-btn" onclick="toggleContainer()">◀</button>
            <h3 className="title">Favorites</h3>
            {favorited.map((item, index) => (
                <button className = "searchhistoryitem" key={index}>{item}</button>
            ))}
            <h3 className="title">Search History</h3>
            {historyitems.map((item, index) => (
                <button className = "searchhistoryitem" key={index}>{item}</button>
            ))}
        </div>
    );
}

export default SearchHistory