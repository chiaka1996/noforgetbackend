const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken"); 

const user_registration_models= require("../models/user_authentication");

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
