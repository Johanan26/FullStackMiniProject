import classes from './DashboardCard.module.css';

function DashboardCard(props) {
  return <div className={classes.card}>{props.children}</div>;
}

export default DashboardCard;
