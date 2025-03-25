import { useState } from "react";
import { useRef } from "react";
import { nanoid } from "nanoid";
import Die from "./Die";
import Confetti from "react-confetti";

// To do
// add a timer to see how long it's taking to finish the game
// change the dice to real looking dice

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());

  const buttonRef = useRef(null);

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value)
      ? true
      : false;

  gameWon ? buttonRef.current?.focus() : null;

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function hold(id) {
    setDice((pervDice) =>
      pervDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function rollDice() {
    gameWon
      ? setDice(generateAllNewDice())
      : setDice((pervDice) =>
          pervDice.map((die) =>
            die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
          )
        );
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      hold={() => hold(dieObj.id)}
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="container">{diceElements}</div>
      <button ref={buttonRef} className="roll-btn" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
