import { useState, useRef, useContext } from 'react';
import GlobalContext from '../../pages/store/globalContext';
import classes from './SimplePostCreator.module.css';

function SimplePostCreator({ onAddPost }) {
  const globalCtx = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const titleInputRef = useRef();
  const textInputRef = useRef();
  const imageInputRef = useRef();
  const fileInputRef = useRef();

  const loggedInUser = globalCtx.theGlobalObject.loggedInUser;

  function handleTextClick() {
    setIsModalOpen(true);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setImagePreview(null);
    if (titleInputRef.current) titleInputRef.current.value = '';
    if (textInputRef.current) textInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const enteredTitle = titleInputRef.current.value.trim();
    const enteredText = textInputRef.current.value.trim();
    const imageFile = fileInputRef.current?.files[0] || imageInputRef.current?.files[0];

    if (!enteredTitle) {
      alert('Please add a title');
      return;
    }

    if (!enteredText && !imageFile) {
      alert('Please add some text or an image');
      return;
    }

    // If there's an image file, convert it to data URL
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result;
        
        const postData = {
          postId: enteredTitle,
          title: enteredTitle,
          image: imageUrl,
          address: '',
          description: enteredText,
          userId: loggedInUser?.uid || null,
          authorName: loggedInUser?.displayName || loggedInUser?.name || 'Anonymous',
        };

        await onAddPost(postData);
        handleCloseModal();
      };
      reader.readAsDataURL(imageFile);
    } else {
      // No image, just text post - use a placeholder or default
      const postData = {
        postId: enteredTitle,
        title: enteredTitle,
        image: 'https://via.placeholder.com/600x400/2a2a2a/667eea?text=Text+Post', // Placeholder
        address: '',
        description: enteredText,
        userId: loggedInUser?.uid || null,
        authorName: loggedInUser?.displayName || loggedInUser?.name || 'Anonymous',
      };

      await onAddPost(postData);
      handleCloseModal();
    }
  }

  return (
    <>
      <div className={classes.creator}>
        <div className={classes.textInput} onClick={handleTextClick}>
          <span className={classes.placeholder}>What's on your mind?</span>
        </div>
        <div className={classes.imageUpload}>
          <label htmlFor="image-upload" className={classes.uploadLabel}>
            <span>📷 Add Image</span>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
          {imagePreview && (
            <div className={classes.preview}>
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  fileInputRef.current.value = '';
                }}
                className={classes.removePreview}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={classes.modalOverlay} onClick={handleCloseModal}>
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h2>Create Post</h2>
              <button className={classes.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
              <div className={classes.formGroup}>
                <input
                  type="text"
                  ref={titleInputRef}
                  placeholder="Post Title"
                  className={classes.titleInput}
                  required
                  autoFocus
                />
              </div>
              <div className={classes.formGroup}>
                <textarea
                  ref={textInputRef}
                  placeholder="What's on your mind?"
                  className={classes.textArea}
                  rows={6}
                />
              </div>
              {imagePreview && (
                <div className={classes.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <div className={classes.formActions}>
                <label htmlFor="modal-image-upload" className={classes.imageButton}>
                  📷 Add Image
                  <input
                    type="file"
                    id="modal-image-upload"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <div className={classes.submitButtons}>
                  <button type="button" onClick={handleCloseModal} className={classes.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" className={classes.submitButton}>
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SimplePostCreator;

