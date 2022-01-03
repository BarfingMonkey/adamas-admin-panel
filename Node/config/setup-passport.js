const passport = require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy
const LocalStrategy= require('passport-local').Strategy
const config= require('config')
const clientID = config.get('clientID');
const clientSecret = config.get('clientSecret')
const User = require('../models/User')
const bcrypt= require('bcryptjs')
const handleErrors= require('../Routes/api/authentication')
const randomize= require('randomatic')

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null, user)
    })
})

passport.use("google",
    new GoogleStrategy({
        callbackURL: "/api/google/redirect",
        clientID: clientID,
        clientSecret: clientSecret,
        proxy: true,
    },(accesstoken, refreshToken, profile, done)=>{
        console.log(profile.emails[0].value)
        const email = profile.emails[0].value
        User.findOne({email}).then((currentUser)=>{
            if(currentUser){
                console.log('User already exists: ', currentUser)
                done(null, currentUser)
            }
            else{
                const password = randomize('*', 10);
                console.log('password ', password)
                const user= new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: password,
                }).save().then((newUser)=>{
                    console.log('new user created: ', newUser);
                    done(null, newUser)
                })
            }
        })
    })
)


passport.use(
    new LocalStrategy({ usernameField: 'email' },
    (username, password, done) => {
        console.log('inside local strategy')
        User.findOne({ email:username }, (err, user) => {
            console.log(err)
            //console.log(user)
            if (err) throw err;
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                    //console.log('user', user)
                    return done(null, user);
                }
                else {
                    console.log('else')
                    return done(null, false);
                }
            });
        });
    })
);