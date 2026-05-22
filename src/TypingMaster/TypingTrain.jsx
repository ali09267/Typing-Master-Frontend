import { useState } from 'react';
import { useEffect } from 'react';
import './TypingTrain.css';
function TypingTrain({playerId,onBack}){

const [totalTime, setTotalTime] = useState(29);//how much time you have(changes after levels)
const [timeLeft, setTimeLeft] = useState(29);//how much time you have left(changes after every second)
const [resetTimer, setResetTimer] = useState(0);//timer reset when component mounts/refreshes
const [resetting, setResetting] = useState(false);
const [roundStatus, setRoundStatus] = useState("playing");//playing(isTyping), win(isCorrect + isEnter), lost(!isCorrect + timeUp), wrong(!isCorect + isEnter)
const [showResult, setShowResult] = useState(false);//if the enter button is pressed, then showResult is true means time to tell whether the sentence is right or wrong
const [inputValue,setInputValue]=useState("");//tracking sentence in input field which u r writing
const [level, setLevel]=useState(0);
const [levelTimes, setLevelTimes] = useState([]);
const [feedback, setFeedback] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

    //Music code 
  useEffect(()=>{
      const audio = new Audio("/train.mp3"); // path from public
      audio.loop = true; // optional: loop forever
  
       audio.currentTime = 2;
      audio.play().catch((err) => {
        console.log("Autoplay prevented by browser:", err);

        //clean up code
        return () => {
    audio.pause();       // stop music
    audio.currentTime = 0; // reset
  };
      });
    },[])

    //resetting game, take 20 ms and clear the time
    useEffect(() => {
  if (resetting) {
    const t = setTimeout(() => setResetting(false), 20); // very short delay
    return () => clearTimeout(t);
  }
}, [resetting]);

useEffect(() => {
  if (gameStarted) return; // only trigger if not started yet

  const startGameOnKey = () => {
    setGameStarted(true);//set state var to true 
    setIsActive(true); // start the timer
  };

  window.addEventListener("keydown", startGameOnKey);

  return () => window.removeEventListener("keydown", startGameOnKey);
}, [gameStarted]);


//array of paragraphs(any random will appear)
    const trainSentences = [
  "This paragraph starts at center and moves like a train out of screen",
  "Every journey begins with a single step, and this sentence is ready to roll across the screen",
  "Like the sound of a whistle blowing, this line departs slowly and fades out into the distance",
  "Words are moving forward with purpose, just like passengers heading to an unknown destination",
  "The sentence begins in stillness, then rolls leftward into the flow of invisible motion",
  "Starting in the middle, this message glides out like a thought vanishing into memory",
  "Watch these words leave the station of your mind and race toward silence",
  "The line slides from view, much like time slipping quietly past our grasp",
  "With each pixel traveled, the sentence leaves behind a trace of meaning and motion",
  "It starts here, right before your eyes, and slowly escapes into the digital horizon",
  "This text was never meant to stay, just pass through, silently and smoothly",
  "Let this string of words flow away, like a river drifting toward an unseen shore",
  "In the blink of an eye, the paragraph moves beyond what you can hold on to",
  "These letters are like train windows, showing glimpses of moments you will soon forget",
  "From center to edge, this sentence races the wind and vanishes without a sound",
  "Words appear, hover briefly, then march forward to exit your view forever",
  "Every sentence begins somewhere, but not every sentence waits around to be read twice",
  "Gliding softly to the side, this line disappears like breath on a mirror",
  "You're watching a thought in motion, exiting the screen like a memory in time",
  "Starting bold in the middle, this message exits stage left without a final word",
  "This is just a passing thought, rolling quietly across your screen like an express train",
  "The center gave it birth, and the left edge will take it away forever",
  "No punctuation can stop it, this sentence moves like a dream fading at dawn",
  "Here and gone, the message travels across pixels as if it has a destination",
  "The sentence leaves no footprints, only a trace of rhythm and flow",
  "Eyes read what vanishes, that is the magic of motion and language together",
  "Now you see it, now you chase it, this sentence refuses to stop",
  "From screen center to far beyond, this text wants nothing more than to be gone",
  "Words travel smoother than wheels when they are powered by animation and style",
  "This is not a sentence, it is a journey set to begin and end with no return",
  "Watch it slide, feel it move, let the sentence drift out of sight and mind",
  "As the screen scrolls this line away, know that more are waiting to follow",
  "Letters align with purpose, then dissolve into movement like dancers exiting stage left",
  "Every sentence has a direction, and this one is headed west at full speed",
  "The center point marks the beginning, but the edge is the end for all text",
  "This train of thought is leaving now, make sure you read it before it is gone",
  "Messages like this are fleeting, just passing shadows in the theater of your screen",
  "Hold this sentence while you can, because it is already on its way out",
  "Even thoughts like this must go, and this one is catching the last digital train",
  "Typed here, visible now, and then slipping away with each passing second"
];

//track the state of current paragraph
const [randomItem, setRandomItem] = useState(() =>
      getRandomParagraph()
    );

//which color to put based on percentage of progress bar left
const percentage = (timeLeft / totalTime) * 100;

 useEffect(() => {
    if (roundStatus !== "playing" && roundStatus!=="wrong") return; //pause timer as user either win or lost

  const startTime = Date.now();//time when access this LOC
  const timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    const newTimeLeft = Math.max(totalTime - elapsed, 0);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      setRoundStatus("lose");//time's up and you haven't press enter key 
      setShowResult("true");//time to show result (you lose)
      clearInterval(timer);//reset time 
      setTimeLeft(0);//reset progress bar
    }
  }, 0.5); // update every 50ms for smooth animation

  return () => clearInterval(timer);
}, [resetTimer,totalTime,roundStatus,gameStarted]);

useEffect(() => {
  if (roundStatus === "lose" && levelTimes.length > 0) {
    saveScoreToDB();
  }
}, [roundStatus]);


//which color to choose of progress bar based on percentage it covers
const getColor = () => {
  if (percentage > 80) return "limegreen";
  if(percentage>50) return "rgba(210, 210, 9, 0.96)";
  if (percentage > 25) return "orange";
  return "red";
};
//0-1*40=0-40=any trainSentences from [0-40] 
    function getRandomParagraph() {
    return trainSentences[Math.floor(Math.random() * trainSentences.length)];
  }
//if your input field is equals to sentence given
const isCorrect = () => randomItem.trim() === inputValue.trim();

function nextTry(){
  const decreasedTime=2;//decrease by 2 secs on each level

  if(roundStatus==="win"){
      setTotalTime(prev=> {
      const newTime = prev - decreasedTime;
      setTimeLeft(newTime); // reset bar to full width
      return newTime;
    });
  }
     setRandomItem(getRandomParagraph());
  setInputValue("");
  setShowResult(false);
   setRoundStatus("playing");
  setResetTimer(prev => prev + 1);
  setResetting(true);
}

function setEnterFunction(e){
  if(e.key==="Enter"){

  if(isCorrect()){
    const timeTaken = totalTime - timeLeft;

          setFeedback("correct");
    setRoundStatus("win");//you won
    setShowResult(true);//time to show result (you did it, next level)
    setLevel(prev=>prev+1);//update level number
      setLevelTimes(prev => [...prev, timeTaken]);//store time taken in level in array
          setTimeLeft(0);//game over, clean the time

  }
  else{
          setFeedback("wrong");
        setShowResult(true);
  }
}
}

function resetGame() {
  const INITIAL_TIME = 29;

  setTotalTime(INITIAL_TIME);
  setTimeLeft(INITIAL_TIME);

  setRandomItem(getRandomParagraph());
  setInputValue("");

  setShowResult(false);
  setRoundStatus("playing");

  setResetTimer(prev => prev + 1);
  setResetting(true);
}

const saveScoreToDB=async()=>{
  
  console.log("Player ID: ",playerId);
  console.log("Level: ",level);
  console.log("Times per level: ",levelTimes);
   try {
    const response = await fetch("http://localhost:8000/api/save-train", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
  player_id: playerId, // from select
  level_reached:level, 
  times_per_level:levelTimes,
}),

    });

    const data = await response.json();

    console.log("SCORE SAVED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ Error saving score:", error);
  }
}

    return (
      <>
       {!gameStarted && (

      <div className="intro-overlay">
        <h2>Press Enter key to start ...⌨️</h2>
        <p>.Type the given sentence before the progress bar ends!</p>
                <p>.The progress bar will start automatically once you press enter key</p>
                   <p>.Make sure you type accurate sentence (exactly same as given) and immediately press enter key after you completely typed the sentence for checking</p>
              <p>.In case of any error, the progress bar will not stop until the sentence is typed correctly so you have to not only focus on speed but also accuracy</p>
              <p>.Make sure you click the input field to make it focus!</p>
              <p>.On succesfull completion, you will jump to next level, each level is difficult then the prev one!</p>

      </div>

    )}

       {gameStarted && (
  <div className="TypingTrainWrapper">

    <p className='para-train'>
      {randomItem}
    </p>

    <div style={{
      width: "45%",
      height: "40px",
      backgroundColor: "#ddd",
      borderRadius: "20px",
      overflow: "hidden",
      marginBottom: "10px",
      minWidth: "200px"
    }}>
      <div style={{
        width: `${percentage}%`,
        height: "100%",
        backgroundColor: getColor(),
         transition: resetting ? "width 0s linear, background-color 0s" 
                        : "width 0s linear, background-color 2s"
      }} />
    </div>

    {/* Input */}
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      disabled={percentage<=0}
      onKeyDown={setEnterFunction}
    />
    <button onClick={onBack} className='go-back-train'>
      Go Back
    </button>

   {showResult && (
  <>
    {feedback === "correct" && roundStatus === "win" && (
      <>
        <p>You Did It 🎉</p>
        <button onClick={nextTry} className="nxt-level btn">
          Next Level
        </button>
      </>
    )}

    {feedback === "wrong" && roundStatus === "playing" && (
      <p>Oops! You typed it wrong ❌</p>
    )}

    {roundStatus === "lose" && (
      <>
        <p>You Lose 😢 Time’s up!</p>
        <button onClick={resetGame} className='play-again btn'>Play Again</button>
        <br />
      </>
    )}
  </>
)}

  </div>)}
  </>
);

}
export default TypingTrain;
