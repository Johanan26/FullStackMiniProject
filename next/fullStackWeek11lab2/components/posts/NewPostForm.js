import { useRef, useEffect } from 'react';

import Card from '../ui/Card';
import classes from './NewPostForm.module.css';

function NewPostForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();

  useEffect(() => {
    if (props.initialData) {
      titleInputRef.current.value = props.initialData.title || '';
      imageInputRef.current.value = props.initialData.image || '';
      addressInputRef.current.value = props.initialData.address || '';
      descriptionInputRef.current.value = props.initialData.description || '';
    }
  }, [props.initialData]);

  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const postData = {
      _id: props.initialData?._id,
      postId: enteredTitle,
      title: enteredTitle,
      image: enteredImage,
      address: enteredAddress,
      description: enteredDescription,
    };

    props.onAddPost(postData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='title'>Post Title (must be unique)</label>
          <input type='text' required id='title' ref={titleInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='image'>Post Image</label>
          <input type='url' required id='image' ref={imageInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='address'>Address</label>
          <input type='text' required id='address' ref={addressInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            required
            rows='5'
            ref={descriptionInputRef}
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button>{props.initialData ? 'Update Post' : 'Add Post'}</button>
        </div>
      </form>
    </Card>
  );
}

export default NewPostForm;
