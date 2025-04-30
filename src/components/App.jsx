import { useEffect, useState } from "react";
import { useRef } from "react";
import { nanoid } from "nanoid";
import Die from "./Die";
import Confetti from "react-confetti";

// To do
// add a timer to see how long it's taking to finish the game

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [rollCount, setRollCount] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const buttonRef = useRef(null);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setGameWon(true);
      setGameRunning(false);
    } else {
      setGameWon(false);
    }
  }, [dice]);

  // const gameWon =
  //   dice.every((die) => die.isHeld) &&
  //   dice.every((die) => die.value === dice[0].value)
  //     ? true
  //     : false;

  gameWon ? buttonRef.current?.focus() : null;

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      // value: Math.ceil(Math.random() * 6),
      value: 1,
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
    if (gameWon) {
      setGameRunning(false);
    } else {
      setGameRunning(true);
    }
  }

  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice());
      setRollCount(0);
      setGameRunning(false);
    } else {
      setDice((pervDice) =>
        pervDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
      setRollCount((prev) => prev + 1);
      setGameRunning(true);
    }
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      hold={() => hold(dieObj.id)}
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      gameWon={gameWon}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti recycle={false} numberOfPieces={1000} />}
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
      <div className="status">
        <p>Total Roll: {rollCount}</p>
        <p>{gameRunning ? "running" : "not running"}</p>
      </div>
      <div className="container">{diceElements}</div>
      <button ref={buttonRef} className="roll-btn" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
