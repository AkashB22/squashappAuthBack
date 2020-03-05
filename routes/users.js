var express = require('express');
var router = express.Router();

let UserModel = require('./../models/users');
let authenticate = require('./../helper/authenticate');
let validation = require('./../helper/validation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next)=>{
  let { errors } = validation.signup(req);

  if(errors){
    res.status(400).json({
      'info': errors.details[0].message
    });
  } else{
    let newUser = new UserModel({
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    });

    try {
      newUser = await newUser.save();
      res.status(200).json({
        info: 'user save successfully',
        token: newUser.generateJWT()
      });
    } catch (error) {
      next(error);
    }
  }
})

router.post('/signin', async (req, res, next)=>{
  let { errors } = validation.signin(req);

  if(errors){
    res.status(400).json({
      'info': errors.details[0].message
    });
  } else{
    let email = req.body.email;
    let password = req.body.password;

    try {
      let user = await UserModel.findOne({email: email});
      if(!user){
        res.status(401).json({
          info: `No user with ${email}`
        });
      } else{
        user.verifyPassword(password, (err, isValid)=>{
        if(!isValid){
          res.status(401).json({
            info: 'password is not matching'
          });
        } else{
          res.status(200).json({
            info: 'user signed in successfully',
            token: user.generateJWT()
          });
        }
        })
      }
    } catch (error) {
      next(error);
    }
    
  }

})

router.post('/resetcheck', async (req, res, next)=>{
  let { errors } = validation.resetCheck(req);

  if(errors){
    res.status(400).json({
      'info': errors.details[0].message
    });
  } else{
    let email = req.body.email;
    let phone = req.body.phone;

    try {
      let user = await UserModel.findOne({email: email, phone: phone});
      if(!user){
        res.status(401).json({
          info: `No user with ${email} and ${phone}`
        });
      } else{
        res.status(200).json({
          info: 'valid user to update password'
        });
      }
    } catch (error) {
      next(error);
    }
  }
})

router.put('/resetpassword', async (req, res, next)=>{
  let { errors } = validation.resetPassword(req);

  if(errors){
    res.status(400).json({
      'info': errors.details[0].message
    });
  } else{
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;

    try {
      let user = await UserModel.findOne({email: email, phone: phone});
      if(!user){
        res.status(401).json({
          info: `No user with ${email} and ${phone}`
        });
      } else{
        user.password = password;
        await user.save();

        res.status(200).json({
          info: 'password reset done successfully',
          token: user.generateJWT()
        });
      }
    } catch (error) {
      next(error);
    }
  }
})

router.get('/profile', authenticate.verify, async (req, res, next)=>{
  let user = req.login;

  delete user._doc._id;
  delete user._doc.password;
  delete user._doc.salt;

  res.status(200).json({
    user: user
  });
})

module.exports = router;
