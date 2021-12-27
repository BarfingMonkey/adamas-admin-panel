const passport = require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy
const config= require('config')
const clientID = config.get('clientID');
const clientSecret = config.get('clientSecret')
const User = require('../models/User')

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        callbackURL: "/api/google/redirect",
        clientID: clientID,
        clientSecret: clientSecret,
        proxy: true,
    },(accesstoken, refreshToken, profile, done)=>{
        console.log(profile.emails[0].value)
        User.findOne({googleId:profile.id}).then((currentUser)=>{
            if(currentUser){
                console.log('User already exists: ', currentUser)
                done(null, currentUser)
            }
            else{
                const password = randomize('*', 10);
                const user= new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: password,
                }).then((newUser)=>{
                    console.log('new user created: ', newUser);
                    done(null, newUser)
                })
            }
        })
    })
)