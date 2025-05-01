import { useEffect, useState } from "react";
import { useRef } from "react";
import { nanoid } from "nanoid";
import Die from "./Die";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [rollCount, setRollCount] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const buttonRef = useRef(null);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

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
      setElapsedTime(0);
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

  useEffect(() => {
    if (gameRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 100);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [gameRunning]);

  function formatStopwatchTime() {
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  }

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
        <p className="timer">{formatStopwatchTime()}</p>
        <p className="total-rolls">Total Roll: {rollCount}</p>
      </div>
      <div className="container">{diceElements}</div>
      <button ref={buttonRef} className="roll-btn" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
