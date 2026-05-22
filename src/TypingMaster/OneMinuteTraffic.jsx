import englishWords from "./Words";
import { useState } from "react";
import { useEffect } from "react";
import './OneMinuteTraffic.css';
import { useRef } from 'react';
function OneMinTraffic({playerId,onBack}){

      const audioRef = useRef(null);
  
   useEffect(()=>{
      const audio = new Audio("/one_min.mp3"); // path from public
      audio.loop = true; // optional: loop forever
  
       audio.currentTime = 2;
       audioRef.current = audio;
      audio.play().catch((err) => {
        console.log("Autoplay prevented by browser:", err);

        return () => {
    audio.pause();       //  stop music
    audio.currentTime = 0; // reset
  };
      });
    },[])

let target=60;
  const [inputValue,setInputValue]=useState("");
    const [showResult, setShowResult] = useState(false);
    const [randomItem, setRandomItem] = useState(() =>
      randomWordDisplay()
    );
      const [isActive, setIsActive] = useState(false); //timer is paused initially
      const[seconds,setSeconds]=useState(0);
      const[score,setScore]=useState(0);
        const [wordsSaved, setWordsSaved] = useState(false);
        const [gameStarted, setGameStarted] = useState(false);

        //will be execute when a key press and starts the game
        useEffect(() => {
  if (gameStarted) return; // only trigger if not started yet

  const startGameOnKey = () => {
    setGameStarted(true);//set state var to true 
    setIsActive(true); // start the timer
  };

  window.addEventListener("keydown", startGameOnKey);

  return () => window.removeEventListener("keydown", startGameOnKey);
}, [gameStarted]);


    useEffect(() => {
    let timer;

    if (isActive && seconds < target) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    // stop timer at 60
    if (seconds === target) {
      setIsActive(false);
    }

    return () => clearInterval(timer); // cleanup
  }, [isActive, seconds]);

  function start() {
  setIsActive(true);
}

  function randomWordDisplay(){
        return englishWords[Math.floor(Math.random() * englishWords.length)];
  }

  function isEnter(e){
    if (e.key === "Enter" && isCorrect()) {
    handleClick(); // only advance on correct word
    setScore(prev=>prev+1);
  }
    
  }
  const handleClick=()=>{
    setRandomItem(randomWordDisplay()); // load new para
    setInputValue(""); // clear input
    setShowResult(false); // hide result
  }

  const isCorrect = () => randomItem.trim() === inputValue.trim();

   const saveScoreToDB = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/save-words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
  player_id: playerId, // from select
  total_words:score 
}),

    });

    const data = await response.json();

      setWordsSaved(true);
    console.log("SCORE SAVED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ Error saving score:", error);
  }
};

useEffect(() => {
  if (seconds === target && !wordsSaved && playerId) {
    saveScoreToDB();
  }
}, [seconds]);

    return(<>

       {!gameStarted && (
      <div className="intro-overlay">
        <h2>Press any key to start ⌨️</h2>
        <p>Type the given words as fast as you can in 1 minute! Press Enter key after typing word so that new word appears</p>
      </div>

    )}
        <div className="one-minute-wrapper">

     {gameStarted && (
      <>
      {seconds < target ? (
      <>
      <h2>Time: {seconds} secs</h2>
        <p className="Paragraph">{randomItem}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) =>{
         setInputValue(e.target.value);
        }}
        onClick={start} 
          style={{ width: "180px" }} 
          onKeyDown={isEnter}
          autoFocus
        />
        <p>Score: {score}</p>
        <br/>
                 <button onClick={onBack} className='go_back'>Go Back</button>

      </>
    ) : (
      <>
        <h2>⏱ Time's up!</h2>
        <h3>Your final score is: {score}</h3>
        <p style={{ fontSize: "1.5rem" }}>
         {score <= 10
    ? "As slow as a tortoise ever could be!"
    : score <= 20
    ? "Your keyboard is working... are you?"
    : score<=30
    ?"Good Typing. Keep practicing!"
  :score<=40
  ?"Bravo! You are truly a typing Master" 
  :score<=45
  ?"You are not just a master, you're a ninja"
 :"You are not a human being....."}
        </p>
                        <button onClick={onBack}>Go Back</button>

      </>
    )}
    </>
     )}
  </div>
    </>);
}

export default OneMinTraffic;
