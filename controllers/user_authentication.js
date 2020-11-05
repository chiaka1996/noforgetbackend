const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken"); 

const generatePassword = require('password-generator');

const nodemailer = require('nodemailer');

const user_registration_models= require("../models/user_authentication");

//register users
exports.user_registration= (req, res) => {

  let errorArray= [];

  const usernameRegex = /[a-z]+[0-9]*/gi;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;


  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    errorArray.push("please fill all fields");
}

if (!usernameRegex.test(username) || username.length < 5 || username.length > 7) {
    errorArray.push('username should start with a letter, contain omly letters and numbers, be between 5 & 7 characters')
}

if (!emailRegex.test(email)) {
    errorArray.push('please input the correct email');
  }

if (password.length < 7) {
    errorArray.push('password should be more than 7')
  }

  user_registration_models.findOne({ email }).then(
    (user) => {
      if (user) {
        errorArray.push('email already exists');
      }

      if (errorArray.length > 0) {
        return res.status(201).json({errorArray });
      }

      //hash the password and save to the database
      bcrypt.hash(password, 10).then(
        (hash) => {

          const userProfile = new user_registration_models({
            username,
            email, 
            password: hash
          });
          
          userProfile.save()
            .then(() => {

            res.status(200).json("user registered");
            })
            .catch((err) => res.status(400).json(`Error: ${err}`)); 
      }

      ).catch((err) => res.status(400).json(`Error: ${err}`)); 

    }
  ).catch((err) => res.status(400).json(`Error: ${err}`));
  }

  //login user 
  exports.userLogin = (req, res) => {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;

    const { email, password } = req.body;

    if( !email || !password) {
         res.status(201).json({message: 'please fill all fields'})
    }

    else {

      if (!emailRegex.test(email)) {
        res.status(201).json({message: 'please input a valid email'})
      }

      else{
      user_registration_models.findOne({ email }).then(
        (user) => {

          if (!user) {
            return res.status(201).json({ message: 'email and password do not match' });
          } 

          bcrypt.compare(password, user.password).then(
            (valid) => {

              if (!valid) {
                return res.status(201).json({ message: 'email and password do not match' });
              }

              const token = jwt.sign(
                  { userId: user._id},
                  'RANDOM_TOKEN_SECRET_NUMBER',
                  { expiresIn: '24h'}
              );

              res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                token,
                message: "user looged in"
              });

            }
          ).catch((err) => res.status(400).json(`Error: ${err}`));
  

        }
      ).catch((err) => res.status(400).json(`Error: ${err}`)); 
      }
    }  
  }

  //change password
  exports.changePassword = (req, res) => {
    const {_id,username,email, oldPassword, newPassword} = req.body

    if(!oldPassword || !newPassword) {
      res.status(201).json("please fill all fields")
    }
    else{

      if (oldPassword.length < 7 || newPassword < 7) {
        res.status(201).json("password should be 7 or more characters")
      }
      else {
        user_registration_models.findOne({ _id })
        .then(
          (response) => {
            if (response) {
              bcrypt.compare(oldPassword, response.password).then(
                (valid) => {
                  if (!valid) {
                    res.status(201).json('incorrect old password')
                  }
                  else {
                   bcrypt.hash(newPassword, 10).then(
                      (hash) => {
                    const passwordchange = new user_registration_models({
                      _id,
                      username, 
                      password: hash,
                      email,
                  })

                  user_registration_models.updateOne({_id: req.body._id}, passwordchange)
                  .then(() => {
                      res.status(200).json('password changed successfully');
          
                  }).catch((err) => res.status(400).json(err))
          
                }).catch((err) => res.status(400).json(err))
                }
                }
              )

            }
          }
        )
      }

    }    
  }

  //forgort password
  exports.forgotPassword = (req, res) => {
    const {email} = req.body
    console.log(email)
    user_registration_models.findOne({ email }).then(
      (userProfile) => {
        if (!userProfile) {
          res.status(201).json('email does not exist')
        }

        else {
        let newPassword =   generatePassword(12, false, /\w/)
        var transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 587,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        })

        var mailOptions = {
          from: 'chiakajunior@zohomail.com',
          to: email,
          subject: 'YOUR NEW PASSWORD FROM noForget',
          text: newPassword
        }

        transporter.sendMail(mailOptions, (error, data) => {
          if (error) {
            
            res.status(201).json(error)
          } else {

            bcrypt.hash(newPassword, 10).then(
              (hash) => {
            const forgottenPassword = new user_registration_models({
              _id: userProfile._id,
              username: userProfile.username,
              password: hash,
              email: userProfile.email
          })

          user_registration_models.updateOne({email: userProfile.email}, forgottenPassword)
          .then(() => {
              res.status(200).json('please, check your email for your new password');
  
          }).catch((err) => res.status(400).json(err))
  
        }).catch((err) => res.status(400).json(err))
          }
        })
        // res.status(200).json(newPassword);
        }
      }).catch((err) => res.status(400).json(err))

  }

  //update profile
  exports.updateProfile = (req, res) => {

    let errorArray= [];

    const usernameRegex = /[a-z]+[0-9]*/gi;
  
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;

    const {_id, email, username, password} = req.body

    if ( !email || !username || !_id ) {
      res.status(201).json('please fill all fields')
    }

    else {

      if (!usernameRegex.test(username) || username.length < 5 || username.length > 7) {
        errorArray.push('username should start with a letter, contain omly letters and numbers, be between 5 & 7 characters')
    }
    
    if (!emailRegex.test(email)) {
        errorArray.push('please input the correct email');
      }

      if (errorArray.length < 1) {

        const updateprofile = new user_registration_models({
          _id,
          username,
          password,
          email
      })

        user_registration_models.updateOne({ _id }, updateprofile)
        .then(
          () => {
            res.status(200).json('profile updated successfully')
          }
        ).catch((err) => res.status(400).json(err))
       
      }
    }
  }

  

