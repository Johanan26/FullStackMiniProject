import MainNavigation from './MainNavigation';
import styles from './Layout.module.css';

function Layout(props) {
  return (
    <div className={styles.layout}>
      <MainNavigation />
      <main className={styles.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
