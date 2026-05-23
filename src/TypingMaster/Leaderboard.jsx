import './Leaderboard.css';
import { useState, useEffect } from 'react';

function Leaderboard({onBack}) {
    const [scores, setScores] = useState([]);//to store each row of free fall leaderboard
    const [words,setWords]=useState([]);//to store each row of one minute traffic leaderboard
    const[time,setTime]=useState([]);//store each row of fire typing
    const[train,setTrain]=useState([]);
    const[specialScore, setSpecialScore]=useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/get_score")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setScores(data)
            })
            .catch(error => console.error(error));
    }, [])

     useEffect(() => {
        fetch("http://localhost:8000/api/get_words")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setWords(data)
            })
            .catch(error => console.error(error));
    }, [])

     useEffect(() => {
        fetch("http://localhost:8000/api/get_time")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTime(data)
            })
            .catch(error => console.error(error));
    }, [])

    useEffect(()=>{
      fetch("http://localhost:8000/api/get_train")
      .then(response=>response.json())
      .then(data=>{
        console.log(data);
        setTrain(data);
      })
      .catch(error=>console.log(error));

        },[])

        useEffect(() => {
        fetch("http://localhost:8000/api/get_score_ii")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSpecialScore(data)
            })
            .catch(error => console.error(error));
    }, [])
    return (<>
    <div className="leaderboard-wrapper">

             <button className="go_back" onClick={onBack}>
                Back
             </button>
<br/><br/>
      <h2>Free Fall Rankings</h2>
        <table className="user-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER_NAME</th>
                    <th>TOTAL_SCORE</th>
                    <th>AVERAGE_SCORE</th>
                    <th>HIGH_SCORE</th>
                    <th>TYPING_POINTS</th>
                </tr> </thead>
            <tbody>    
                     {scores.length > 0 ? (
          scores.map((item, index) => (
            <tr key={item.player_id}>
              <td>{index + 1}</td>
              <td>{item.player_name}</td> {/* replace with name if available */}
              <td>{item.total}</td>
              <td>{item.average}</td>
              <td>{item.high_score}</td>
              <td>{item.typing_points}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Loading...</td>
          </tr>
        )} 
            </tbody>
        </table>
        <br/><br/>

        {/*ONE MINUTE TRAFFIC*/}
      <h2>One Minute Traffic Rankings</h2>

        <table className="user-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER_NAME</th>
                    <th>TOTAL_SCORE</th>
                    <th>AVERAGE_SCORE</th>
                    <th>HIGH_SCORE</th>
                    <th>TYPING_POINTS</th>
                </tr> </thead>
            <tbody>              
                     {words.length > 0 ? (
          words.map((item, index) => (
            <tr key={item.player_id}>
              <td>{index + 1}</td>
              <td>{item.name}</td> {/* replace with name if available */}
              <td>{item.total}</td>
              <td>{item.average}</td>
              <td>{item.high_score}</td>
                <td>{item.typing_points}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Loading...</td>
          </tr>
        )} 
            </tbody>
        </table>

        <br/><br/>

        {/*FIRE TYPING */}
      <h2>Fire Typing Rankings</h2>

         <table className="user-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER_NAME</th>
                    <th>AVERAGE_TIME</th>
                    <th>LEAST_TIME</th>
                    <th>TYPING_POINTS</th>
                </tr> </thead>
            <tbody>    
                     {time.length > 0 ? (
          time.map((item, index) => (
            <tr key={item.player_id}>
              <td>{index + 1}</td>
              <td>{item.player_name}</td> {/* replace with name if available */}
              <td>{item.average_seconds}</td>
              <td>{item.least_seconds}</td>
              <td>{item.typing_points}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Loading...</td>
          </tr>
        )} 
            </tbody>
        </table>

         {/*TYPING TRAIN */}
<br/><br/>
               <h2>Typing Train Rankings</h2>

         <table className="user-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER_NAME</th>
                    <th>HIGHEST_LEVEL</th>
                    <th>AVG_TIME</th>
                    <th>TYPING_POINTS</th>
                </tr> </thead>
            <tbody>    
                     {train.length > 0 ? (
          train.map((item, index) => (
            <tr key={item.player_id}>
              <td>{index + 1}</td>
              <td>{item.name}</td> {/* replace with name if available */}
              <td>{item.max_level}</td>
              <td>{item.avg_time}</td>
              <td>{item.typing_points}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Loading...</td>
          </tr>
        )} 
            </tbody>
        </table>

{/*FREE FALL 2 */}
<br/><br/>
               <h2>Free Fall II Rankings</h2>

         <table className="user-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER_NAME</th>
                    <th>TOTAL_SCORE</th>
                    <th>AVG_SCORE</th>
                    <th>HIGH_SCORE</th>
                    <th>TYPING_POINTS</th>
                </tr> </thead>
            <tbody>    
                     {specialScore.length > 0 ? (
          specialScore.map((item, index) => (
             <tr key={item.player_id}>
              <td>{index + 1}</td>
              <td>{item.player_name}</td> {/* replace with name if available */}
              <td>{item.total}</td>
              <td>{item.average}</td>
              <td>{item.high_score}</td>
              <td>{item.typing_points}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Loading...</td>
          </tr>
        )} 
            </tbody>
        </table>
        </div>
    </>
    );
}
export default Leaderboard;
