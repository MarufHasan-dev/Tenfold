import Die_1 from "../assets/images/dice_1.png";
import Die_2 from "../assets/images/dice_2.png";
import Die_3 from "../assets/images/dice_3.png";
import Die_4 from "../assets/images/dice_4.png";
import Die_5 from "../assets/images/dice_5.png";
import Die_6 from "../assets/images/dice_6.png";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? " #59e391" : "#ffffff",
  };

  const diceImages = {
    1: Die_1,
    2: Die_2,
    3: Die_3,
    4: Die_4,
    5: Die_5,
    6: Die_6,
  };

  return (
    <button
      className="die"
      style={styles}
      onClick={props.hold}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, ${
        props.isHeld ? "held" : "not held"
      }`}
      disabled={props.gameWon ? true : false}
    >
      <img className="dice-icons" src={diceImages[props.value]} alt="" />
    </button>
  );
}
