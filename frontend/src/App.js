import React, { useState, useRef } from 'react';
import tree from './homebackground/tree.png';
import kim from './homebackground/kim.png';
import chirpsound from './homebackground/helloaudio.mp3';
import dialoguebox from './homebackground/dialoguebox.png'
import './App.css';
import Buttons from './search/Buttons.js';
import Summaries from './summary/Summaries.js';
import Signin from './login-register/Signin.js';
import Signout from './login-register/Signout.js';
import SearchHistory from './searchhistorysidebar/searchhistorybar.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [summaryList, setSummaryList] = useState("");
  const [linkList, setLinkList] = useState("");
  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const [user_ID, setUserID] = useState("");
  const audioRef = useRef(null);

  const handleError = (error) => {
    toast.error(String(error));
  }

  const handleNotification = (message) => toast(message);

  const handleLogin = (user_id) => {
    setUserID(user_id, () => {
      console.log("UserID: " + user_ID); // This might still log the previous state
    });
    toast("Logged In")
  };

  const handleLogout = () => {
    setUserID("")
    toast("Logged Out")
  };

  const searchFailed = () => {
    handleError("Search Failed")
    setSearchBarVisibility(false);
  }

  const handleCategory = (buttonsData) => {
    search("none", buttonsData, user_ID);
    setSearchBarVisibility(true);
  };

  const handleSearch = (searchbarData) => {
    search(searchbarData, "none", user_ID);
    setSearchBarVisibility(true);
  }

  const clearSummaries = () => {
    setSummaryList(null);
    setSearchBarVisibility(false);
  };

  const search = async (keyword, category, user_id) => {
    try {
      const result = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, category, user_id }),
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
      searchFailed();
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
        {user_ID === "" && <Signin setError={ handleError } setUserID={ handleLogin } setNotification={ handleNotification }/>}
        {user_ID !== "" && <Signout setLogout={ handleLogout } />}
        {user_ID !== "" && <SearchHistory />}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
