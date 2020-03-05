let mongoose = require('mongoose');
let mongooseUniqueValidator = require('mongoose-unique-validator')
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    }
},{
    timestamps: true
})

UserSchema.plugin(mongooseUniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, Expect {PATH} to be unique'
});

UserSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(this.password, salt, (err, hash)=>{
                this.password = hash;
                this.salt = salt;
                return next();
            })
        })
    } else{
        return next();
    }
})

UserSchema.methods.verifyPassword  = function(password, callback){
    bcrypt.compare(password, this.password, (err, res)=>{
        callback(err, res);
    })
}

UserSchema.methods.generateJWT = function(){
    return jwt.sign({
        id: this.id
    }, 'mySecretForJWT', {expiresIn: '1h'});
}

module.exports = mongoose.model('user', UserSchema);