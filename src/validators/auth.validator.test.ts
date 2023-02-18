import { describe, expect, it } from '@jest/globals';
import { 
    validateRegisterBody, 
    validateLoginBody,
    validateVerifyMailBody,
    validateRefreshTokenBody,
    validateEmailBody,
    validateResetPasswordBody
} from './auth.validators';

describe('validateRegisterBody', () => {
    it('returns error if email is not provided', () => {
        const data = {
            password: 'password123',
            comparePassword: 'password123'
        };
        const { error } = validateRegisterBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" is required/);
    });

    it('returns error if email is not valid', () => {
        const data = {
            email: 'not-an-email',
            password: 'password123',
            comparePassword: 'password123'
        };
        const { error } = validateRegisterBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" must be a valid email/);
    });

    it('returns error if password is not provided', () => {
        const data = {
            email: 'test@example.com',
            comparePassword: 'password123'
        };
        const { error } = validateRegisterBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" is required/);
    });

    it('returns error if password is less than 6 characters', () => {
        const data = {
            email: 'test@example.com',
            password: 'short',
            comparePassword: 'short'
        };
        const { error } = validateRegisterBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" length must be at least 6 characters long/);
    });

    it('returns error if comparePassword does not match password', () => {
        const data = {
            email: 'test@example.com',
            password: 'password123',
            comparePassword: 'not-the-same'
        };
        const { error } = validateRegisterBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch("\"comparePassword\" must be [ref:password]");
    });

    it('returns value if all fields are valid', () => {
        const data = {
            email: 'test@example.com',
            password: 'password123',
            comparePassword: 'password123'
        };
        const { error, value } = validateRegisterBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
});

describe('validateLoginBody', () => {
    it('returns error if email is not provided', () => {
        const data = {
            password: 'password123'
        };
        const { error } = validateLoginBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" is required/);
    });

    it('returns error if email is not valid', () => {
        const data = {
            email: 'not-an-email',
            password: 'password123'
        };
        const { error } = validateLoginBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" must be a valid email/);
    });

    it('returns error if password is not provided', () => {
        const data = {
            email: 'test@example.com'
        };
        const { error } = validateLoginBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" is required/);
    });

    it('returns error if password is less than 6 characters', () => {
        const data = {
            email: 'test@example.com',
            password: 'short'
        };
        const { error } = validateLoginBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" length must be at least 6 characters long/);
    });

    it('returns value if all fields are valid', () => {
        const data = {
            email: 'test@example.com',
            password: 'password123'
        };
        const { error, value } = validateLoginBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
});

describe('validateVerifyMailBody', () => {
    it('returns error if verifyToken is not provided', () => {
        const data = { };
        const { error } = validateVerifyMailBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"verifyToken" is required/);
    });

    it('returns value if verifyToken is provided', () => {
        const data = {
            verifyToken: 'test-token'
        };
        const { error, value } = validateVerifyMailBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
})

describe('validateRefreshTokenBody', () => {
    it('returns error if refreshToken is not provided', () => {
        const data = { };
        const { error } = validateRefreshTokenBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"refreshToken" is required/);
    });

    it('returns value if refreshToken is provided', () => {
        const data = {
            refreshToken: 'test-token'
        };
        const { error, value } = validateRefreshTokenBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
})

describe('validateEmailBody', () => {
    it('returns error if email is not provided', () => {
        const data = { };
        const { error } = validateEmailBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" is required/);
    });

    it('returns error if email is not correct', () => {
        const data = {
            email: 'not-an-email'
        };
        const { error } = validateEmailBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"email" must be a valid email/);
    });

    it('returns value if email is provided', () => {
        const data = {
            email: 'mario@gmail.com'
        };
        const { error, value } = validateEmailBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
})

describe('validateResetPaswordBody', () => {
    it('returns error if resetPasswordToken is not provided', () => {
        const data = {
            password: 'password123',
            comparePassword: 'password123'
        };
        const { error } = validateResetPasswordBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"resetPasswordToken" is required/);
    });

    it('returns error if password is not provided', () => {
        const data = {
            resetPasswordToken: 'reset-password-token',
            comparePassword: 'password123'
        };
        const { error } = validateResetPasswordBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" is required/);
    });

    it('returns error if comparePassword is not provided', () => {
        const data = {
            resetPasswordToken: 'reset-password-token',
            password: 'password123'
        };
        const { error } = validateResetPasswordBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"comparePassword" is required/);
    });

    it('returns error if password is less than 6 characters', () => {
        const data = {
            resetPasswordToken: 'reset-password-token',
            password: 'short',
            comparePassword: 'short'
        };
        const { error } = validateResetPasswordBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"password" length must be at least 6 characters long/);
    });

    it('returns error if comparePassword does not match password', () => {
        const data = {
            resetPasswordToken: 'reset-password-token',
            password: 'password123',
            comparePassword: 'not-the-same'
        };
        const { error } = validateResetPasswordBody(data);
        expect(error).toBeDefined();
        expect(error.message).toMatch("\"comparePassword\" must be [ref:password]");
    });

    it('returns value if all fields are valid', () => {
        const data = {
            resetPasswordToken: 'reset-password-token',
            password: 'password123',
            comparePassword: 'password123'
        };
        const { error, value } = validateResetPasswordBody(data);
        expect(error).toBeUndefined();
        expect(value).toEqual(data);
    });
});