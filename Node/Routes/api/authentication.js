const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const User= require('../../models/User')
const jwt = require('jsonwebtoken');
const passport = require('passport')
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

exports.handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
}

// create json web token
// const maxAge = 3 * 24 * 60 * 60;
// const createToken = (id) => {
//   return jwt.sign({ id }, 'adamas project', {
//     expiresIn: maxAge
//   });
// };
  
// router.post('/signup', async(req,res)=>{
//     //console.log(`form data ${req.body.name}`)
//     const {name, email, password} = req.body
//     try {
//         const user = await User.create({ name, email, password });
//         const token = createToken(user._id);
//         console.log(token)
//         res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//         res.status(201).json({ user: user, token });
//       }
//       catch(err) {
//         const errors = handleErrors(err);
//         res.json({ errors });
//       }
// })

// router.post('/login', async(req,res)=>{
//   console.log(`form data: ${req.body.name} ${req.body.password}`)
//   const { email, password } = req.body;
//   try {
//     const user = await User.login(email, password);
//     const token = createToken(user._id);
//     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     res.status(201).json({ user: user, token });
//   } 
//   catch (err) {
//     const errors = handleErrors(err);
//     res.json({ errors });
//   }
// })
router.post('/signup', async(req,res)=>{
  console.log(`form data: ${req.body.name} ${req.body.password}`)
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json("Signup Successful");
  }
  catch(err) {
    //const errors = handleErrors(err);
    console.log(err)
    res.json("Signup Failed");
  }
})

router.post("/login", (req, res, next) => {
  console.log('login hit')
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    console.log(user)
    console.log(err)
    console.log(info)
    if (!user) res.json("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({user:req.user});
        console.log(req.user);
      });
    }
  })(req, res, next);
});


router.get('/logout', async(req,res)=>{
  console.log('logout api hit')
  req.logout();
  res.json("logout successful")
})

// auth with google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile','email']
}));  

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('http://localhost:3000/')
});
router.get('/user',(req,res)=>{
  res.send({user: req.user})
})

module.exports = router;