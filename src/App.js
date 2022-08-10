import './App.css';
import Die from "./components/Die"
import React from "react"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

function App() {

  // --- Extra ---
  // CSS: Put real dots instead of numbers
  // Track the number of rolls
  // Track the time it took to win
  // Save best time to localStorage
  
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    const firstValue = dice[0].value
    const allHeld = dice.every(die => die.isHeld)
    const allSame = dice.every(die => die.value === firstValue)

    if (allHeld && allSame) {
      setTenzies(true)
      console.log("You won!")
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

  function rollDice() {

    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
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
