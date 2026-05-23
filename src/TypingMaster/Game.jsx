import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import './Game.css';
import React from 'react';

function Game({playerId,onBack}){
const audioRef = useRef(null);
  useEffect(()=>{
     const audio = new Audio("/fire_type.mp3"); // path from public
      audio.loop = true; // optional: loop forever
  
       audio.currentTime = 1.6;
       audioRef.current = audio; 
      audio.play().catch((err) => {
        console.log("Autoplay prevented by browser:", err);
});
        return () => {
    audio.pause();       // stop music
    audio.currentTime = 0; // reset
  };
  
},[]);
  
  console.log(playerId);
     const paragraphs = [
  "The quick brown fox jumps over the lazy dog",
  "Once upon a time, there lived a kind hearted girl named Cinderella",
  "Rapunzel let her hair down from the tower window silently",
  "In a world full of noise, silence is power",
  "Success comes from small efforts repeated every single day",
  "All that glitters is not gold, but often temptation",
  "The mind replays negative thoughts more than positive ones",
  "Twinkle twinkle little star, how I wonder what you are",
  "Never judge a book by its beautiful or plain cover",
  "Dream big, work hard, and stay kind no matter what",
  "Reading daily builds vocabulary, focus, and imagination power",
  "Smiling can trick your brain into feeling a little happier",
  "Better late than never, especially when learning something new",
  "You miss every shot you do not take, so aim confidently",
  "Mirror mirror on the wall, who is the fairest of all",
  "Sleep helps the brain reset and improves memory power",
  "Practice makes progress, not perfection, so keep going",
  "Kind words cost nothing but mean everything to someone",
  "Short walks improve your creativity and reduce stress levels",
  "Sometimes not getting what you want is a lucky break",
   "Time waits for no one, so use it wisely today",
  "Little drops of water make the mighty ocean someday",
  "Laughter is a universal language that connects every soul",
  "Patience is bitter, but its fruit is always sweet",
  "Believe in yourself even when no one else does",
  "Great minds discuss ideas, average minds discuss events",
  "Beauty begins the moment you decide to be yourself",
  "The pen is mightier than the sword, always remember that",
  "Light travels faster than sound, hence people seem bright until they talk",
  "It always seems impossible until it is done successfully",
  "The empty minds are the devils workshop, so stay busy",
  "A good book is a best friend for life",
  "True friends are never apart, maybe in distance but not heart",
  "Happiness is found when you stop comparing yourself to others",
  "The darkest nights produce the brightest stars in life",
  "Education is the passport to the future we create today",
  "Do not cry because it is over, smile because it happened",
  "Winners are not afraid of losing, they learn and grow",
  "Kindness is a language the deaf can hear and blind see",
  "A single kind thought can change the entire day"
];
  const[isRunning,setIsRunning]=useState(false);
  const[elapsedTime,setElapsedTime]=useState(0);
  const [inputValue,setInputValue]=useState("");
  const [showResult, setShowResult] = useState(false);
  const [randomItem, setRandomItem] = useState(() =>
    getRandomParagraph()
  );
  const [gameStarted, setGameStarted] = useState(false);


  function getRandomParagraph() {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
  }
  
  const intervalIDRef=useRef(null);
  const startTimerRef=useRef(null);

      useEffect(()=>{
          if(isRunning){
             intervalIDRef.current= setInterval(()=>{
                  setElapsedTime(Date.now()-startTimerRef.current);
              },10);
          }
  
          return()=>{
              clearInterval(intervalIDRef.current);
          }
      },[isRunning])

       useEffect(() => {
  if (gameStarted) return; // only trigger if not started yet

  const startGameOnKey = () => {
    setGameStarted(true);//set state var to true 
  };

  window.addEventListener("keydown", startGameOnKey);

  return () => window.removeEventListener("keydown", startGameOnKey);
}, [gameStarted]);
  
      function start(){
          if (!isRunning) {
      setIsRunning(true);
      startTimerRef.current = Date.now() - elapsedTime;
    }
      }
      function stop(){
          setIsRunning(false);
      }
  
      function reset(){
          setElapsedTime(0);
          setIsRunning(false);
      }
  
      function format(){
          let min=Math.floor(elapsedTime/(1000*60)%60);
  
          let sec=Math.floor(elapsedTime/(1000)%60);
  
          let milliSecs=Math.floor((elapsedTime % 1000)/10);
  
            min=String(min).padStart(2,"0");
          sec=String(sec).padStart(2,"0");
          milliSecs=String(milliSecs).padStart(2,"0");
  
          return `${min}:${sec}:${milliSecs}`;
      }

const isCorrect = () => randomItem == inputValue;

const isEnter=(e)=>{
    if(e.key==="Enter"){
        console.log("time:- ",elapsedTime);

      setShowResult(true);
      stop();
      if (isCorrect()) {
      saveScoreToDB();
    }
    }
}

function handleClick(){
    setRandomItem(getRandomParagraph()); // load new para
    setInputValue(""); // clear input
    setShowResult(false); // hide result
    reset(); // reset timer
}

function getStars(){
  if (!isCorrect()) return 0;

  if (elapsedTime < 7000) return 5;
  if (elapsedTime < 9000) return 4;
  if (elapsedTime < 12000) return 3;
  if (elapsedTime < 15000) return 2;
  if (elapsedTime < 21000) return 1;
  return 0;
}

function renderStars(count) {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < count ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

 const saveScoreToDB = async () => {

  try {
    const response = await fetch("http://localhost:8000/api/save-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
  player_id: playerId, // from select
  total_elapsed_time:elapsedTime
}),
    });

    const data = await response.json();

    console.log("SCORE SAVED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ Error saving score:", error);
  }
};

   return(
   <>
    {!gameStarted && (
      <div className="intro-overlay">
        <h2>Press any key to start ⌨️</h2>
        <p>.Type the given sentence as fast as you can!</p>
                <p>.The timer will start when you start tying your sentence in input field</p>
                   <p>.Make sure you type accuratee sentence (exactly same as given) and immediately press enter key after you completely typed the sentence for checking</p>
              <p>.In case of any error, the timer will stop which will let you find the mistake and take your time</p>
      </div>

    )}

    {gameStarted && (

   <div className="FireWrapper">
    <div className="display">
            {format()}
        </div>
        <div className="controls">
           
        </div>
    <p className="Paragraph">{randomItem}</p>
        <input type="text" value={inputValue} 
        className="input-field"
        onChange={(e) =>{
         setInputValue(e.target.value);
         start();
        }
        } onKeyDown={isEnter}
        />
        <br/>
  <button onClick={onBack} className='go_back'>Back</button>

          {showResult && (
            <>
        <p className="Paragraph">{ isCorrect()
     ? elapsedTime < 7000
        ? "As Fast As A Lightining Ever Could Be! Are You Even A Human Being"
        : elapsedTime < 9000
        ? "Well Done! Super Fast"
        : elapsedTime < 12000
        ? "Good Typing, 75% Can't Type As Fast As You"
         : elapsedTime < 15000
        ? "You Are An Average Typist"
        : elapsedTime < 21000
        ? "Its not just about fast typing, without accuracy, it's just fast mistakes.."

        : "Their regrets lasted until the Day of Judgment.!"
      : "❌ You Did Wrong :("}</p>

      {isCorrect() && renderStars(getStars())}

        <button onClick={handleClick} className="nxt">Next Try</button>
        </>
      )}
    </div>
    )}
    </>)
}
export default Game;
