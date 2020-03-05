let Joi = require('@hapi/joi');

let validation = {};

validation.signup = (req)=>{
    let schema = Joi.object({
        email: Joi.string().min(6).max(30).email().required(),
        phone: Joi.string().min(10).max(30).required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(req.body);
}

validation.signin = (req)=>{
    let schema = Joi.object({
        email: Joi.string().min(6).max(30).email().required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(req.body);
}

validation.resetCheck = (req)=>{
    let schema = Joi.object({
        email: Joi.string().min(6).max(30).email().required(),
        phone: Joi.string().min(10).max(30).required()
    });

    return schema.validate(req.body);
}

validation.resetPassword = (req)=>{
    let schema = Joi.object({
        email: Joi.string().min(6).max(30).email().required(),
        phone: Joi.string().min(10).max(30).required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(req.body);
}

module.exports = validation;