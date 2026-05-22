import React, { useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Game from './Game';
import FreeFall from './Free-Fall';
import TypingTrain from './TypingTrain';
import OneMinTraffic from './OneMinuteTraffic';    
import Leaderboard from './Leaderboard';
import FreeFallII from './Free-Fall-II';  

import './MainPanel.css';

function MainPanel() {
  const [showComponent, setShowComponent] = useState(null);//to track component which u r opening 
  const [showNameModal, setShowNameModal] = useState(false);
  const [names, setNames] = useState([]);//to track player name 
  const [selectedPlayerId, setSelectedPlayerId] = useState("");//to track player id


  //Music code
  const audioRef=useRef(null);

useEffect(() => {
  if (!audioRef.current) {
    const audio = new Audio("/Home_Music.mp3");
    audio.loop = true;
    audio.currentTime = 2;
    audio.play().catch(err => console.log("Autoplay blocked", err));
    audioRef.current = audio;
  }

  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };
}, []);

  //When user click any component then open that component code

  const handleClick = (gameName) => {
    // Pause MainPanel music before switching to game
  if (gameName!=='Leaderboard' && audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
    setShowComponent(gameName); // This triggers rendering of the new component
  };

  const goBack = () => setShowComponent(null);

  //React forgots which component to mount after it gets refreshed so useEffect code which runs everytime whenever we refresh to tell react that these were all the prev entered names 
  useEffect(() => {
  fetch("http://localhost:8000/api/get_names")//fetching data from laravel router named get_names
    .then(res => res.json())//convert the response which is received from laravel router into JSON format 
    .then(data => {
      setNames(data);//then set that data into names state variable 
    })
    .catch(err => console.error(err));//if any error occurs print that error 
}, []);


  //When user enter new name then insert that new name into db through laravel code and receive that name with all other names from db through laravel code 
  const submitLogic = () => {
    const name = document.getElementById("usernameInput").value;
    alert("New Name Added: " + name);
    setShowNameModal(false);

    fetch('http://localhost:8000/api/insert', {//insert new name to the table
      method: 'POST',//post method to make it secret
      headers: {
        'Content-Type': 'application/json',//json format type
        'Accept': 'application/json' //json format acceptance
      },
      body: JSON.stringify({//convert JSON to string 
        name: name
      })
    })
      .then(res => res.json()) //  parse JSON here
      .then(data => {
        console.log(data);
        return fetch("http://localhost:8000/api/get_names");//no need to refresh 
      }
      ).then(res => res.json())
      .then(updatedNames => {
        setNames(updatedNames); //update dropdown immediately
        console.log(updatedNames);
      })
      .catch(err => console.error(err));
  };

  return (<>
  <div className="main-panel-wrapper">
    {!showComponent ? (
      <>
        <div onClick={() => setShowNameModal(true)} className="enter-name">New Name</div>

        <select className='players-dropdown'  value={selectedPlayerId}   onChange={(e) => setSelectedPlayerId(e.target.value)}>
          
          <option value="">Select Name</option>
          
          {names.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>


        <div onClick={() => handleClick("Leaderboard")} className="leaderboard">Leaderboard</div>

        <div className="container">

          <div onClick={() => handleClick("Free Fall")} className="free-fall shape">Free Fall</div>
          <div onClick={() => handleClick("Fire Typing")} className="fire shape">Fire Typing</div>
          <div onClick={() => handleClick("Typing Train")} className="train shape">Typing Train</div>
          <div onClick={() => handleClick("One Minute Traffic")} className="traffic shape">One Minute Traffic</div>
          <div onClick={() => handleClick("Free Fall II")} className="free-fall-II shape">Free Fall II</div>
        </div>
      </>
    ) : (
      <>

        {showComponent === "Free Fall" && <FreeFall key="freefall" playerId={selectedPlayerId} onBack={goBack}/>}
        {showComponent === "Fire Typing" && <Game key="fire" playerId={selectedPlayerId} onBack={goBack}/>}
        {showComponent === "Typing Train" && <TypingTrain key="train" playerId={selectedPlayerId} onBack={goBack}/>}
        {showComponent === "One Minute Traffic" && <OneMinTraffic key="oneMin" playerId={selectedPlayerId} onBack={goBack}/>}
        {showComponent === "Free Fall II" && <FreeFallII key="free-2" playerId={selectedPlayerId} onBack={goBack}/>}
                {showComponent === "Leaderboard" && <Leaderboard key="leader"  onBack={goBack} />}
      </>
   )}


    {showNameModal && (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2 className='name-header'>Enter Your Name</h2>

          <input
            type="text"
            className="modal-input"
            placeholder="Type name here..."
            id="usernameInput"
          />

          <div className="modal-buttons">
            <button
              className="modal-submit"
              onClick={submitLogic}>
              Submit
            </button>

            <button
              className="modal-cancel"
              onClick={() => setShowNameModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
</div>
  </>)
}
export default MainPanel;
