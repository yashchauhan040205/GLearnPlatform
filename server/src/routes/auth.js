const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, refreshToken, verifyEmail, resendVerification } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [student, educator] }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Email already registered }
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', login);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/refresh', protect, refreshToken);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Email verified successfully }
 *       400: { description: Invalid or expired token }
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Verification email sent }
 *       404: { description: User not found }
 *       429: { description: Too many requests }
 */
router.post('/resend-verification', resendVerification);

module.exports = router;
