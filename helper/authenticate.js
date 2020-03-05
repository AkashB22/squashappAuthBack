let jwt = require('jsonwebtoken');
let UserModel = require('./../models/users');

let auth = {};

auth.verify = (req, res, next)=>{
    let authHeader = req.headers['authorization'];
    let token = authHeader.split(' ')[1];

    if(token){
        jwt.verify(token, 'mySecretForJWT', (err, decodedToken)=>{
            if(err){
                res.status(401).json({
                    info: 'Error in decoding the token'
                })
            } else{
                let userId = decodedToken.id;
                if(userId){
                    UserModel.findById(userId, (err, user)=>{
                        if(err){
                            res.status(500).json({
                                info: 'Internal Server Error'
                            })
                        }
                        if(!user){
                            res.status(401).json({
                                info: 'No user with the given userid'
                            })
                        } else {
                            req.login = user;
                            res.setHeader('X-Auth-Token', token);
                            next();
                        }
                    })
                } else{
                    res.status(401).json({
                        info: 'no userid in the token'
                    })
                }
            }
        })

    } else{
        res.status(404).json({
            info: 'missing token'
        })
    }
    
}

module.exports = auth;