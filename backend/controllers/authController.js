const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role, profile } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ email, password, role, profile });
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !await user.comparePassword(password)) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(400).json({ message: 'Account is deactivated' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  async logout(req, res) {
    // In a stateless JWT system, logout is handled client-side
    
    res.json({ success: true, message: 'Logged out successfully' });
  }
  
async getRole(req, res) {
  try {
    const { role } = req.user;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role not found for user'
      });
    }

    
    let mappedRole;
    if (role === 'doctor') {
      mappedRole = 'doctor';
    } else if (role === 'patient') {
      mappedRole = 'patient';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role'
      });
    }

    res.status(200).json({
      success: true,
      role: mappedRole
    });

  } catch (error) {
    console.error('Error in getRole endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
}

module.exports = new AuthController();