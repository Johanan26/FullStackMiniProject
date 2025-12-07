import classes from './Card.module.css';

function Card(props) {
  // If noWrapper prop is true, render card without the centering wrapper
  if (props.noWrapper) {
    return (
      <div className={classes.cardNoWrapper} onClick={props.onClick}>{props.children}</div>
    );
  }
  
  return (
    <div className={classes.cardWrapper}>
      <div className={classes.card} onClick={props.onClick}>{props.children}</div>
    </div>
  );
}

export default Card;
