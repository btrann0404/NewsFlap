import React, { useState, useRef } from 'react';
import tree from './homebackground/tree.png';
import kim from './homebackground/kim.png';
import chirpsound from './homebackground/helloaudio.mp3';
import dialoguebox from './homebackground/dialoguebox.png'
import './App.css';
import Buttons from './search/Buttons.js';
import Summaries from './summary/Summaries.js';
import Signin from './login-register/Signin.js';

function App() {
  const [summaryList, setSummaryList] = useState("");
  const [linkList, setLinkList] = useState("");
  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const audioRef = useRef(null);

  const handleCategory = (buttonsData) => {
    search("none", buttonsData);
    setSearchBarVisibility(true);
  };

  const handleSearch = (searchbarData) => {
    search(searchbarData, "none");
    setSearchBarVisibility(true);
  }

  const clearSummaries = () => {
    setSummaryList(null);
    setSearchBarVisibility(false);
  };

  const search = async (keyword, category) => {
    try {
      const result = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, category }),
      });
 
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
 
      const response = await result.json();
      console.log("Full Reponse:", response)
      setSummaryList(response.summaries);
      setLinkList(response.links)
    } catch (error) {
      console.error("Error during fetch:", error);
    }
 };
 
  const chirp = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    console.log("chirped")
  };

  return (
    <div className="App">
      <div className="main-page">
        <img src={tree} className="tree" alt="tree" />
        <audio ref={audioRef} src={ chirpsound }/>
        <button className="chirp" onClick={chirp}><img src={kim} className="bird" alt="tree" /></button>
        <figure className="dialoguebox">
        <img src={dialoguebox} alt="dialoguebox" />
        <div className="dialoguecontainer"><p className="dialogue">They call me rocket man</p></div>
        </figure>
        <Buttons setCategoryFromButtons={ handleCategory } setSearchFromButtons={ handleSearch } searchBar = { searchBarVisibility }/>
        <Summaries summaryList = { summaryList } linkList = { linkList } clearSummaryList = { clearSummaries }/>
        <Signin />
      </div>
    </div>
  );
}

export default App;
