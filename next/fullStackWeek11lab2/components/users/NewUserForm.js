import { useRef } from 'react';

import Card from '../ui/Card';
import classes from '../posts/NewPostForm.module.css';

function NewUserForm(props) {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const ageInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredAge = ageInputRef.current.value;

    const userData = {
      userId: enteredName,
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      age: enteredAge,
    };

    props.onAddUser(userData);
  }

  return (
    <Card>
      <h1 className={classes.header}> Register </h1>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='name'>Name</label>
          <input type='text' required id='name' ref={nameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='email'>Email</label>
          <input type='email' required id='email' ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Password</label>
          <input type='password' required id='password' ref={passwordInputRef} minLength={6} />
        </div>
        <div className={classes.control}>
          <label htmlFor='age'>Age</label>
          <input type='text' required id='age' ref={ageInputRef} />
        </div>
        <div className={classes.actions}>
          <button disabled={props.loading}>{props.loading ? 'Creating account...' : 'Sign Up'}</button>
        </div>
      </form>
    </Card>
  );
}

export default NewUserForm;
