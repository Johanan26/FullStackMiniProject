import { useRef } from 'react';

import Card from '../ui/Card';
import classes from '../posts/NewPostForm.module.css';


function LoginForm(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const userData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    props.loginUser(userData);
  }

  return (
    <Card>
      <h1 className={classes.header}> Login </h1>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Email</label>
          <input type='email' required id='email' ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Password</label>
          <input type='password' required id='password' ref={passwordInputRef} />
        </div>
        
        <div className={classes.actions}>
          <button disabled={props.loading}>{props.loading ? 'Logging in...' : 'Login'}</button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don&apos;t have an account?{' '}
          <a href="/new-user">Sign up</a>
        </p>
      </form>
    </Card>
  );
}

export default LoginForm;
