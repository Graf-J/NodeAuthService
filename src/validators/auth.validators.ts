import Joi from 'joi';

const validateRegisterBody = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        comparePassword: Joi.string().required().valid(Joi.ref('password'))
    });

    return schema.validate(data);
}

const validateLoginBody = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data);
}

const validateVerifyMailBody = (data) => {
    const schema = Joi.object({
        verifyToken: Joi.string().required()
    })

    return schema.validate(data);
}

export {
    validateRegisterBody,
    validateLoginBody,
    validateVerifyMailBody
}