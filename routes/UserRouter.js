const express = require('express');

const router = express.Router();
const UserService = require("../services/UserService");
const { verifyToken } = require('../middleware/Authentication');

// Register
router.post('/register', async (req, res) => {
    const user = req.body;
    const userDetails = await UserService.register(user);
    res.json(userDetails);
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = await UserService.login(email, password);
    res.json(token);
});

router.get('/userDetails', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const userDetails = await UserService.getUserDetails(userId);
    res.json(userDetails);
})

router.post('/userChangePasssword', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const passwordDetails = req.body;
    const userDetails = await UserService.changePassword(userId, passwordDetails.newPassword);
    res.json(userDetails);
})

router.post('/isUserCanChangePasssword', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const passwordDetails = req.body;
    const userDetails = await UserService.isUserCanChangePassword(userId, passwordDetails.oldPassword);
    res.json(userDetails);
})

router.get('/isUserExists/:email', async (req, res) => {
    const { email } = req.params;
    const userDetails = await UserService.isUserExists(email);
    res.json(userDetails);
})

router.post('/forgetPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);
    const userDetails = await UserService.forgetPassword(email, newPassword);
    res.json(userDetails);
})

module.exports = router;
