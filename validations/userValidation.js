import joi from 'joi'

const signupValidation = joi.object({
    name : joi.string().min(3).max(30).required(),
    email : joi.string().email().lowercase().required(),
    password : joi.string()
        .min(6)
        .pattern(new RegExp('(?=.*[a-z])'))
        .pattern(new RegExp('(?=.*[A-Z])'))
        .pattern(new RegExp('(?=.*[0-9])'))
        .pattern(new RegExp('(?=.*[!@#$%^&*(),.?":{}|<>])'))
        .required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required()
}).with('password','confirmPassword')

const loginValidation = joi.object({
    email : joi.string().email().required().lowercase(),
    password : joi.string().required()
});



export  {signupValidation, loginValidation}