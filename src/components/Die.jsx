export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? " #59e391" : "#ffffff",
  };
  return (
    <button
      style={styles}
      className="die"
      onClick={props.hold}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, ${
        props.isHeld ? "held" : "not held"
      }`}
    >
      {props.value}
    </button>
  );
}
