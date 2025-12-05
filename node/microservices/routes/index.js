let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

let oldMong = new Mongoose();
oldMong.connect('mongodb://127.0.0.1:27017/db');

let postSchema = new Schema({
  postId: String,
  title: String,
  image: String,
  address: String,
  description: String
}, { collection: 'posts' });

let posts = oldMong.model('posts', postSchema);

let userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true }, 
  password: String,
  age: String,
}, { collection: 'users' });

let user = oldMong.model('users', userSchema);

// Admin server page
router.get('/', async function (req, res, next) {
  res.render('index');
});

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

// Crud
router.post('/createPost', async function (req, res, next) {
  let retVal = { response: "fail" }
  await posts.create(req.body,
    function (err, res) {
      if (!err) {
        retVal = { response: "success" }
      }
    }
  )
  res.json(retVal);
});

// cRud   Should use GET . . . we'll fix this is Cloud next term
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

// crUd   Should use PUT . . . we'll fix this is Cloud next term
// router.post('/updatePost', async function (req, res, next) {
//   let retVal = { response: "fail" }
//   await posts.findOneAndUpdate({ _id: req.body._id }, req.body,
//     function (err, res) {
//       if (!err) {
//         retVal = { response: "success" }
//       }
//     }
//   )
//   res.json(retVal);
// });

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
    const result = await posts.deleteOne({ _id: req.body._id });
 
    if (result && result.deletedCount > 0) {
      retVal = { response: "success" };
    }
 
    res.json(retVal);
  } catch (err) {
    console.log('Could not delete meeting', err);
    res.status(500).json(retVal);
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