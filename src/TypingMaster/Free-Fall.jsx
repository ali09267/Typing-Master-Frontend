import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import './Free-fall.css';
import { useRef } from 'react';

function FreeFall({ playerId ,onBack}) {

  useEffect(() => {
    const audio = new Audio("/free_fall.mp3"); // path from public
    audio.loop = true; // optional: loop forever

    audio.currentTime = 2;
    audio.play().catch((err) => {
      console.log("Autoplay prevented by browser:", err);


    });
  }, [])
  const chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'];//array of chars

  const lanes = [
    4, 8, 12, 16, 20, 24, 28, 32, 36, 40,
    44, 48, 52, 56, 60, 64, 68, 72, 76, 80,
    84, 88, 92, 96, 100
  ];//position of boxes

  const [boxes, setBoxes] = useState([]);//to track boxes
  const [life, setLife] = useState(5);
  const [missedBoxId, setMissedBoxId] = useState(null);
  const [handledBoxIds, setHandledBoxIds] = useState(new Set());
  const [score, setScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [gameKey, setGameKey] = useState(0);//forces react to remount game completely by destroying all prev components when user click on play again
  const [gameStarted, setGameStarted] = useState(false);

  const saveScoreToDB = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          player_id: playerId, // from select
          score: score
        }),

      });

      const data = await response.json();

      setScoreSaved(true); // prevent duplicate calls
      console.log("SCORE SAVED SUCCESSFULLY");
    } catch (error) {
      console.error("❌ Error saving score:", error);
    }
  };

  //start the game on any key press use effect(runs every time the gameStarted use state is triggered or changed)
  useEffect(() => {
    if (gameStarted) return;

    const startOnKey = () => {
      setGameStarted(true);
    };

    window.addEventListener("keydown", startOnKey);

    return () => window.removeEventListener("keydown", startOnKey);
  }, [gameStarted]);


  useEffect(() => {
    if (life === 0 && !scoreSaved && playerId) {
      saveScoreToDB();
    }
  }, [life]);

  useEffect(() => {
    if (missedBoxId === null) return;

    setBoxes(prev => {
      let lostLife = false;

      const updated = prev.map(box => {
        if (box.id === missedBoxId) {
          if (box.visible) {
            lostLife = true;
            console.log("A LIFE IS LOST");
            return { ...box, visible: false };
          } else {
            return box;
          }
        }
        return box;
      });

      if (lostLife) {
        setLife(prev => {
          const newLife = Math.max(prev - 1, 0);
          return newLife;
        });
      }

      return updated;
    });

    // Reset after handling
    setMissedBoxId(null);
  }, [missedBoxId]);

  useEffect(() => {
  }, [life]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const handleKeyPress = (e) => {

      const pressedKey = e.key.toLowerCase();//track which key presses

      setBoxes(prev => {
        let match = false;

        const updatedBox = prev.map(box => {
          if (box.text === pressedKey && box.visible && !match) {
            match = true;
            return { ...box, visible: false };
          }
          return box;
        });

        if (match) {
          setScore(score => score + 1); //update score here
        }

        return updatedBox;
      });
    };

    window.addEventListener('keydown', handleKeyPress);//add event listener to windows

    return () => {
      window.removeEventListener('keydown', handleKeyPress);//clean up code
    };
  }, [gameStarted]);

  useEffect(() => {

    if (!gameStarted) {
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 1000) {
        clearInterval(interval);
        return;
      }
      const randomChar = chars[Math.floor(Math.random() * chars.length)]; //  changed: named variable

      const randomLeft = lanes[Math.floor(Math.random() * lanes.length)];

      //  changed: fully random float from 0 to 95vw
      const newBox = {
        id: count,
        left: randomLeft,//random position
        duration: 2 + Math.random() * 10,//random speed from 2 seconds to 12 seconds
        text: randomChar,
        visible: true
      };
      setBoxes(prev => [...prev, newBox]);
      count++;
    }, 500);//box will come after this period of milliseconds

    return () => clearInterval(interval);
  }, [gameStarted]);

  const handleMissedBox = (id) => {
    setHandledBoxIds(prev => {
      if (prev.has(id)) return prev; //  Already handled

      const updated = new Set(prev);
      updated.add(id);

      setMissedBoxId(id); //Only trigger this once per id

      return updated;
    });
  };

  const reset = () => {
    setBoxes([]);
    setLife(5);
    setScore(0);
    setMissedBoxId(null);
    setHandledBoxIds(new Set());
    setScoreSaved(false);

    setGameKey(prev => prev + 1); // FORCE FULL RESET
  }

  return (

    <div className='FreeFallWrapper' key={gameKey}>
      {!gameStarted && (
        <div className="intro-overlay">
          <h2>Press any key to start ⌨️</h2>
          <p>Catch the falling characters before they escape!</p>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="lane-debug">
            {lanes.map((lane, i) => (
              <div
                key={i}
                className="lane"
                style={{ left: `${lane}vw` }}
              />
            ))}
          </div>

          {life > 0 ? (
            <>
              {boxes.map(box => (
                box.visible && (
                  <div
                    key={box.id}
                    className="box"
                    style={{
                      left: `${box.left}vw`,
                      animationDuration: `${box.duration}s`
                    }}
                    onAnimationEnd={() => handleMissedBox(box.id)}
                  >
                    {box.text}
                  </div>
                )
              ))}

              <div className="life">
                {Array.from({ length: life }).map((_, i) => (
                  <span key={i} className="heart">❤️</span>
                ))}
                <p className="score">{score}</p>
              </div>
            </>
          ) : (
            <>
                {<> <h3 className='score' > 
                  Characters Catched:-{score}
                  </h3><br></br>
                   <h2 className='feedback'>
                     {score <= 20 ?
                      "As slow as a tortoise ever could be!"
                       : score <= 40 ? 
                       "Your keyboard is working... are you?" 
                     : score <= 50 ?
                      "More Imrovement Required!" 
                      : score <= 60 ? 
                      "Good Typing! Practice More" 
                      : score <= 80 ? 
                      "Fast Fingers" 
                      : score <= 100 ? 
                      "Bravo! You are truly a Typing Master"
                       : score <= 150 ?
                        "You are not just a Typing Master, You're a ninja!" 
                        : "You are not a human being....."}</h2> 

                        <div className="button-wrapper">
                           <button onClick={onBack} className='go_back'>Go Back</button> 
                           <button onClick={reset} className='play_again_btn'>Reset</button> 
                           </div> </>}
            </>
          )}
        </>
      )}

    </div>
  );
}
export default FreeFall;
