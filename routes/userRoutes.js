import express from 'express'
import { signupUser, loginUser, getProfile, refreshToken } from '../controllers/userController.js'
import validateRequest from "../middlewares/validateRequest.js"
import authenticateToken from '../middlewares/authenticateToken.js'
import {signupValidation} from '../validations/userValidation.js'

const router = express.Router();

router.post('/signup', validateRequest(signupValidation), signupUser);
router.post('/login', loginUser)
router.post('/refresh-token', refreshToken)

router.get('/profile', authenticateToken , getProfile)

export default router;
