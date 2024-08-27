// routes/forgotPassword.js
import express from 'express';
import { forgotPassword, resetPassword, changePassword, } from '../controllers/forgotPassword.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password/:id', changePassword);

export default router;
