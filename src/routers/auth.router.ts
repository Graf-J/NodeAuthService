import express, { Router } from 'express';
import { 
    register, 
    login, 
    logout,
    refreshToken, 
    sendVerifyMail, 
    verifyMail, 
    forgotPassword, 
    resetPassword, 
    jwks 
} from '../controllers/auth.controller';
const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout)
router.post('/refresh-token', refreshToken);
router.post('/send-verify-mail', sendVerifyMail);
router.post('/verify-mail', verifyMail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/jwks', jwks);

module.exports = router;