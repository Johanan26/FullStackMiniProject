let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

let oldMong = new Mongoose();
let mongoConnected = false;

// MongoDB connection with event handlers
oldMong.connect('mongodb://127.0.0.1:27017/db');

oldMong.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  mongoConnected = true;
});

oldMong.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  mongoConnected = false;
});

oldMong.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  mongoConnected = false;
});

// Test connection on startup
oldMong.connection.once('open', () => {
  console.log('MongoDB connection opened');
  mongoConnected = true;
});

let postSchema = new Schema({
  postId: String,
  title: String,
  image: String,
  address: String,
  description: String,
  userId: String, // Firebase UID of the post author
  authorName: String // Display name of the author
}, { collection: 'posts' });

let posts = oldMong.model('posts', postSchema);

let userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true }, 
  password: String,
  age: String,
  avatar: String,
  firebaseUid: String, // Link Firebase Auth user to MongoDB user
}, { collection: 'users' });

let user = oldMong.model('users', userSchema);

// Admin server page
router.get('/', async function (req, res, next) {
  res.render('index');
});

// Health check endpoint - supports both GET and POST
router.get('/healthCheck', async function (req, res, next) {
  try {
    const connectionState = oldMong.connection.readyState;
    
    if (connectionState === 1) {
      await oldMong.connection.db.admin().ping();
      res.json({ 
        connected: true, 
        status: 'connected',
        message: 'MongoDB is connected and responsive'
      });
    } else {
      res.json({ 
        connected: false, 
        status: getConnectionStatus(connectionState),
        message: 'MongoDB is not connected'
      });
    }
  } catch (err) {
    console.error('MongoDB health check error:', err);
    res.json({ 
      connected: false, 
      status: 'error',
      message: 'MongoDB connection check failed: ' + err.message
    });
  }
});

router.post('/healthCheck', async function (req, res, next) {
  try {
    const connectionState = oldMong.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (connectionState === 1) {
      await oldMong.connection.db.admin().ping();
      res.json({ 
        connected: true, 
        status: 'connected',
        message: 'MongoDB is connected and responsive'
      });
    } else {
      res.json({ 
        connected: false, 
        status: getConnectionStatus(connectionState),
        message: 'MongoDB is not connected'
      });
    }
  } catch (err) {
    console.error('MongoDB health check error:', err);
    res.json({ 
      connected: false, 
      status: 'error',
      message: 'MongoDB connection check failed: ' + err.message
    });
  }
});

function getConnectionStatus(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
}

router.post('/createUser', async function (req, res, next) {
  const user = await createUser(req.body);
  res.json(user);
});

async function createUser(theUser) {
  console.log('theUser: ' + theUser);
  await user.create(theUser,
    function (err, res) {
      if (err) {
        console.log('Could not insert new user')
        return { saveUserResponse: "fail" };
      }
    }
  )
  return { saveUserResponse: "success" };
}

router.post('/getUsers', async function (req, res, next) {
  const user = await getUsers();
  res.json(user);
});

async function getUsers() {
  data = await user.find().lean();
  return { user: data };
}

router.post('/createPost', async function (req, res, next) {
  let retVal = { response: "fail" }
  
  try {
    const postData = {
      postId: req.body.postId,
      title: req.body.title,
      image: req.body.image,
      address: req.body.address || '',
      description: req.body.description || '',
      userId: req.body.userId || null,
      authorName: req.body.authorName || null
    };
    
    const result = await posts.create(postData);
    
    if (result) {
      retVal = { response: "success" }
    }
  } catch (err) {
    console.error('Error creating post:', err);
    retVal = { response: "fail", error: err.message }
  }
  
  res.json(retVal);
});

router.post('/readPost', async function (req, res, next) {
  let data;
  if (req.body.cmd == 'all') {
    data = await posts.find().lean()
  }
  else {
    data = await posts.find({ _id: req.body._id }).lean()
  }
  res.json({ posts: data });
})

router.post('/updatePost', async function (req, res, next) {
  let retVal = { response: "fail" };
 
  try {
    const result = await posts.findOneAndUpdate(
      { _id: req.body._id },
      req.body
    );
 
    if (result) {
      retVal = { response: "success" };
    }
 
    res.json(retVal);
  } catch (err) {
    console.log('Could not update meeting', err);
    res.status(500).json(retVal);
  }
});

router.post('/deletePost', async function (req, res, next) {
  let retVal = { response: "fail" };
 
  try {
    // First, check if the post exists and belongs to the user
    const post = await posts.findOne({ _id: req.body._id }).lean();
    
    if (!post) {
      retVal = { response: "fail", message: "Post not found" };
      return res.json(retVal);
    }
    
    // Verify ownership if userId is provided
    if (req.body.userId && post.userId !== req.body.userId) {
      retVal = { response: "fail", message: "Unauthorized: You can only delete your own posts" };
      return res.json(retVal);
    }
    
    const result = await posts.deleteOne({ _id: req.body._id });
 
    if (result && result.deletedCount > 0) {
      retVal = { response: "success" };
    }
 
    res.json(retVal);
  } catch (err) {
    console.log('Could not delete post', err);
    res.status(500).json(retVal);
  }
});

// Update user profile (name, age, avatar) - creates if doesn't exist
router.post('/updateUserProfile', async function (req, res, next) {
  let retVal = { response: "fail" };
 
  try {
    const updateData = {};
    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }
    if (req.body.age !== undefined) {
      updateData.age = req.body.age;
    }
    if (req.body.avatar !== undefined) {
      updateData.avatar = req.body.avatar;
    }
    if (req.body.email !== undefined) {
      updateData.email = req.body.email;
    }
    if (req.body.firebaseUid !== undefined) {
      updateData.firebaseUid = req.body.firebaseUid;
    }

    // Use upsert to create if doesn't exist, update if exists
    const result = await user.findOneAndUpdate(
      { firebaseUid: req.body.firebaseUid },
      updateData,
      { upsert: true, new: true }
    );
 
    if (result) {
      retVal = { response: "success" };
    }
 
    res.json(retVal);
  } catch (err) {
    console.log('Could not update user profile', err);
    res.status(500).json(retVal);
  }
});

// Get user by Firebase UID
router.post('/getUserByFirebaseUid', async function (req, res, next) {
  try {
    const userData = await user.findOne({ firebaseUid: req.body.firebaseUid }).lean();
    if (userData) {
      res.json({ user: userData });
    } else {
      res.json({ user: null });
    }
  } catch (err) {
    console.log('Could not get user by Firebase UID', err);
    res.json({ user: null });
  }
});
 





router.post('/getPosts', async function (req, res, next) {
  const posts = await getPosts();
  res.json(posts);
});

async function getPosts() {
  data = await posts.find().lean();
  return { posts: data };
}

router.post('/savePost', async function (req, res, next) {
  const posts = await savePost(req.body);
  res.json(posts);
});

async function savePost(thePost) {
  console.log('thePost: ' + thePost);
  await posts.create(thePost,
    function (err, res) {
      if (err) {
        console.log('Could not insert new post')
        return { savePostResponse: "fail" };
      }
    }
  )
  return { savePostResponse: "success" };
}

module.exports = router;