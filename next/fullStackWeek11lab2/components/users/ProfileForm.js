import { useRef, useState, useEffect } from 'react'
import Card from '../ui/Card'
import classes from './ProfileForm.module.css'

function ProfileForm(props) {
    const nameInputRef = useRef()
    const ageInputRef = useRef()
    const avatarInputRef = useRef()
    const [avatarPreview, setAvatarPreview] = useState(props.initialAvatar || '')

    useEffect(() => {
        setAvatarPreview(props.initialAvatar || '')
    }, [props.initialAvatar])

    function handleAvatarChange(event) {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    function handleFileButtonClick() {
        avatarInputRef.current?.click()
    }

    function submitHandler(event) {
        event.preventDefault()
        
        const enteredName = nameInputRef.current.value
        const enteredAge = ageInputRef.current.value
        const enteredAvatar = avatarPreview || null

        const profileData = {
            name: enteredName,
            age: enteredAge,
            avatar: enteredAvatar
        }

        props.onUpdateProfile(profileData)
    }

    return (
        <Card>
            <div className={classes.profileContainer}>
                <h1 className={classes.header}>Profile Settings</h1>
                
                <form className={classes.form} onSubmit={submitHandler}>
                    {/* Avatar Section */}
                    <div className={classes.avatarSection}>
                        <div className={classes.avatarPreview}>
                            {avatarPreview ? (
                                <img 
                                    src={avatarPreview} 
                                    alt="Avatar preview" 
                                    className={classes.avatarImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                            ) : null}
                            <div 
                                className={classes.avatarPlaceholder}
                                style={{ display: avatarPreview ? 'none' : 'flex' }}
                            >
                                <span className={classes.avatarIcon}>👤</span>
                            </div>
                        </div>
                        
                        <div className={classes.avatarControls}>
                            <input 
                                type='file' 
                                id='avatarFile' 
                                accept='image/*'
                                ref={avatarInputRef}
                                onChange={handleAvatarChange}
                                className={classes.hiddenFileInput}
                            />
                            <button
                                type="button"
                                onClick={handleFileButtonClick}
                                className={classes.uploadButton}
                            >
                                <span className={classes.uploadIcon}>📁</span>
                                <span>{avatarPreview ? 'Change Avatar' : 'Upload Avatar'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Name Section */}
                    <div className={classes.control}>
                        <label htmlFor='name'>Name</label>
                        <input 
                            type='text' 
                            required 
                            id='name' 
                            ref={nameInputRef}
                            defaultValue={props.initialName || ''}
                            className={classes.input}
                        />
                    </div>

                    {/* Age Section */}
                    <div className={classes.control}>
                        <label htmlFor='age'>Age</label>
                        <input 
                            type='number' 
                            id='age' 
                            ref={ageInputRef}
                            defaultValue={props.initialAge || ''}
                            min="1"
                            max="120"
                            className={classes.input}
                        />
                    </div>
                    
                    <div className={classes.actions}>
                        <button type="submit" disabled={props.loading} className={classes.submitButton}>
                            {props.loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default ProfileForm

