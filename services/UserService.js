const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MailSender = require('../sendmail/MailSender')

const UserService = {
    register: async (user) => {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = await User.create({ username: user.username, email: user.email, password: hashedPassword });
            return { message: 'User created', newUser };
        } catch (error) {
            return { error: 'User creation failed' };
        }
    },
    login: async (email, password) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user)
                return { message: 'Email id is incorrect' };
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return { message: 'Password is incorrect' };
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            return {
                message: "Login Successfully",
                token: token,
                user
            };
        } catch (error) {
            return { error: 'Login failed' };
        }
    },
    getUserDetails: async (userId) => {
        const userDetails = await User.findById(userId);
        return userDetails;
    },
    changePassword: async (userId, newPassword) => {
        try {
            const userDetails = await User.findById(userId);
            if (userDetails) {
                const isMatch = await bcrypt.compare(newPassword, userDetails.password);
                if (isMatch) {
                    return { message: 'User old password matches new password please try another password' };
                }
                else {
                    userDetails.password = await bcrypt.hash(newPassword, 10);
                    userDetails.save();
                    return { message: "Password changed" };
                }
            }
            else {
                return { message: 'User not Found' };
            }
        }
        catch (error) {
            return { error: 'Change password failed' };
        }
    },
    isUserCanChangePassword: async (userId, oldPassword) => {
        try {
            const userDetails = await User.findById(userId);
            if (userDetails) {
                const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
                if (isMatch) {
                    return {
                        message: 'User Can Change Password',
                        isPasswordCorrect: true
                    };
                }
                else {
                    return {
                        message: 'Password doesn\'t match',
                        isPasswordCorrect: false
                    };
                }
            }
            else {
                return { message: 'User not Found' };
            }
        }
        catch (error) {
            return { error: 'User Can change password failed' }
        }
    },
    isUserExists: async (email) => {
        try {
            const userDetails = await User.findOne({ email: email });
            if (userDetails) {
                const mailOptions = {
                    from: 'agrimarketservice123@gmail.com',
                    to: userDetails.email,
                    subject: "Froget Password",
                    text: "You can change the password by the given link http://localhost:3000/user/forgetpassword"
                };
                MailSender.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error occurred:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                return {
                    message: "User Found",
                    userExists: true
                }
            }
            else {
                return {
                    message: "User Not Found",
                    userExists: false
                }
            }
        }
        catch (error) {
            return { error: 'User forget password failed:' + error }
        }
    },
    forgetPassword: async (email, newPassword) => {
        try {
            console.log(email, newPassword);
            const userDetails = await User.findOne({ email: email });
            console.log(userDetails)
            if (userDetails) {
                const isMatch = await bcrypt.compare(newPassword, userDetails.password);
                if (isMatch) {
                    return { message: 'User old password matches new password please try another password' };
                }
                else {
                    userDetails.password = await bcrypt.hash(newPassword, 10);
                    userDetails.save();
                    return { success: true };
                }
            }
            else {
                return { message: 'User not Found' };
            }
        }
        catch (error) {
            return { error: 'Change password failed' };
        }
    }
}

module.exports = UserService;