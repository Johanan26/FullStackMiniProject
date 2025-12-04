import classes from './Card.module.css';

function Card(props) {
  return (
    <div className={classes.cardWrapper}>
      <div className={classes.card}>{props.children}</div>
    </div>
  );
}

export default Card;
