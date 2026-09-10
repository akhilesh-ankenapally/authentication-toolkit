const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Password validation rule checker
const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }
  return errors;
};

// Register User
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet cybersecurity security standards.',
        errors: passwordErrors
      });
    }

    // 4. Check if user or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username.trim() }, { email: email.toLowerCase().trim() }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this username or email already exists.'
      });
    }

    // 5. Secure Password Hashing with bcrypt (Salt Rounds = 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. Save new user to database
    const newUser = User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with salted bcrypt hash!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: err.message
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    // 1. Validate inputs
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and password are required.'
      });
    }

    // 2. Locate user
    const user = await User.findOne({
      $or: [
        { username: identifier.trim() },
        { email: identifier.toLowerCase().trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // 3. Verify password hash using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    // 4. Generate JWT token (1 hour session validity)
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: err.message
    });
  }
};

// Get Profile (Protected route demonstration)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user,
      session: {
        issuedAt: new Date(req.user.iat * 1000).toISOString(),
        expiresAt: new Date(req.user.exp * 1000).toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

module.exports = {
  validatePassword,
  register,
  login,
  getProfile
};
