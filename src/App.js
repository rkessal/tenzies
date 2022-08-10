import './App.css';
import Die from "./components/Die"
import React from "react"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useStopwatch } from 'react-timer-hook';

function App() {

  // --- Extra ---
  // CSS: Put real dots instead of numbers
  // Track the number of rolls
  // Track the time it took to win
  // Save best time to localStorage
  
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)
  const [time, setTime] = React.useState({min: 999, sec: 999})
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true })
  const currentTime = getTotalTime(minutes, seconds)
  localStorage.setItem("time", getTotalTime(time.min, time.sec))

 

  React.useEffect(() => {
    const firstValue = dice[0].value
    const allHeld = dice.every(die => die.isHeld)
    const allSame = dice.every(die => die.value === firstValue)

    
    if (allHeld && allSame) {
      pause()
      setTime(prevTime => {
        if (currentTime <= localStorage.getItem("time")) {
          return {
            min: minutes,
            sec: seconds
          }
        } else {
          return prevTime
        }
      })
      setTenzies(true)
    }
  }, [dice])
  

  function generateNewDice() {
    const randomNumber = Math.floor(Math.random() * 6) + 1
    return (
      { 
        id: nanoid(),
        value: randomNumber,
        isHeld: false
      }
    )
  }
  
  function allNewDice()  {
    let diceArray = []
    for (let i = 0; i < 10; i++) {
      diceArray.push(generateNewDice()) 
    }
    
    return diceArray
  }

  function getTotalTime(minutes, seconds) {
    return minutes * 60 + seconds
  }

  function rollDice() {

    if (tenzies) {
      reset()
      setDice(allNewDice())
      setRolls(0)
      setTenzies(false)
    } else {
      setRolls(rolls + 1)
    }

    setDice(prevDice => prevDice.map(die => {
      return die.isHeld ? die : generateNewDice()
    }))
    
  }

  function holdDice(id) {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      }))
    }
  }

  



  return (
    <div className="App">
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <br/>
        <div className="scoreboard">
          <div className="rolls">Rolls: {rolls}</div>
          <div className="stopwatch">Time: {`${minutes}:${seconds}`}</div>
          <div className="bestTime">Best Time: {time.min === 999 ? "--:--" : time.min + ":" + time.sec}</div>
        </div>
      <div className="dice-container">
        {dice.map((die) => <Die 
          key={die.id} 
          value={die.value} 
          isHeld={die.isHeld} 
          holdDice={() => holdDice(die.id)}
        />)}

      </div>
      <button className="dice-roll" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
    </div>
  );
}

export default App;
