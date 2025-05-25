# 🏥 Telehealth Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
</div>

<div align="center">
  <h3>🌟 A Modern Telehealth Solution for Remote Healthcare</h3>
  <p>Connecting patients and healthcare providers through secure and comprehensive health management tools.</p>
</div>

---

## 🌐 Live Demo

Experience the Telehealth Platform in action!

**🚀 [View Live Application](https://7fac-103-80-23-36.ngrok-free.app/)**

> **Note**: The application is fully functional with appointment booking and secure patient data management.

---

## 🎥 Video Demonstration

Watch a complete walkthrough of the Telehealth Platform features and functionality.

**📹 [Watch Project Demo](https://www.youtube.com/watch?v=your-demo-video-id)**

> **Note**: The video demonstrates patient registration, doctor consultation booking and the complete healthcare workflow.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation](#️-installation)
- [🔧 Environment Variables](#-environment-variables)
- [📱 Usage](#-usage)
- [🎨 Figma Design](#-figma-design)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)

---

## ✨ Features

### 🧑‍🤝‍🧑 For Patients
- **🔍 Doctor Discovery** - Find and connect with qualified healthcare providers
- **📞 Video Consultations** - High-quality, secure video calls
- **📱 Health Tracking** - Monitor vital signs and health metrics
- **💳 Secure Payments** - Integrated payment processing

### 🏥 For Healthcare Providers
- **📅 Appointment Scheduling** - Flexible scheduling with calendar integration
- **📋 Patient Records** - Secure access to medical histories and records
- **👨‍⚕️ Doctor Dashboard** - Comprehensive patient management interface

### 🔧 Technical Features
- **🔒 End-to-End Encryption** - Secure patient data transmission
- **📱 Responsive Design** - Works seamlessly across all devices
- **⚡ Real-time Communication** - Instant messaging and notifications
- **☁️ Cloud Storage** - Secure document and image storage
- **🔗 API Integration** - RESTful APIs for third-party integrations

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React.js** - Modern UI library for building user interfaces
- **🎨 CSS3/SCSS** - Styling and responsive design
- **📱 React Router** - Client-side routing
- **🔄 Axios** - HTTP client for API requests

### Backend
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js** - Web application framework
- **🍃 MongoDB** - NoSQL database for flexible data storage
- **🔗 Mongoose** - MongoDB object modeling
- **🔐 JWT** - JSON Web Tokens for authentication

### Real-time Communication
- **🔌 Socket.io** - Real-time bidirectional event-based communication

### DevOps & Security
- **🔒 bcrypt** - Password hashing
- **🛡️ Helmet.js** - Security middleware
- **📝 Morgan** - HTTP request logger
- **⚡ Nodemon** - Development server auto-restart

---

## 🚀 Quick Start

Get up and running with the Telehealth platform in minutes!

```bash
# Clone the repository
git clone https://github.com/PriyanshuN19/telehealth.git

# Navigate to project directory
cd telehealth

# Install dependencies for both frontend and backend
npm run install-all

# Set up environment variables
cp .env.example .env

# Start development servers
npm run dev
```

🎉 **That's it!** Your telehealth platform should now be running at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 📁 Project Structure

```
telehealth/
├── 📂 client/                 # React frontend application
│   ├── 📂 public/            # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable React components
│   │   ├── 📂 pages/         # Page components
│   │   ├── 📂 hooks/         # Custom React hooks
│   │   ├── 📂 services/      # API service functions
│   │   ├── 📂 utils/         # Utility functions
│   │   └── 📂 styles/        # CSS/SCSS files
│   └── 📄 package.json
│
├── 📂 server/                # Node.js backend application
│   ├── 📂 controllers/       # Request handlers
│   ├── 📂 models/            # Database models
│   ├── 📂 routes/            # API routes
│   ├── 📂 middleware/        # Custom middleware
│   ├── 📂 config/            # Configuration files
│   ├── 📂 utils/             # Utility functions
│   └── 📄 package.json
│
├── 📄 README.md              # Project documentation
├── 📄 .env.example           # Environment variables template
└── 📄 package.json           # Root package.json
```

---

## ⚙️ Installation

### Prerequisites
- **📦 Node.js** (v14.0.0 or higher)
- **🍃 MongoDB** (v4.0 or higher)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PriyanshuN19/telehealth.git
   cd telehealth
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set Up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `telehealth`

5. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

---

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/telehealth
DB_NAME=telehealth

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000

# Payment Gateway 
VITE_SQUARE_APP_ID=your_app_id
VITE_SQUARE_LOCATION_ID=your_location_id
SQUARE_ACCESS_TOKEN=your_sandbox_access_token

# Transcription
DEEPGRAM_API_KEY=your_DEEPGRAM_API_key

# Video Call Service
WEBRTC_CONFIG=your_webrtc_configuration
```

---

## 📱 Usage

### For Patients

1. **🔐 Registration & Login**
   - Create an account with email verification
   - Complete your medical profile

2. **🔍 Find Healthcare Providers**
   - Browse doctors by specialization
   - View ratings and availability
   - Read reviews from other patients

3. **📅 Book Appointments**
   - Select preferred time slots
   - Choose consultation type (video/chat)
   - Make secure payments

4. **📞 Attend Consultations**
   - Join video calls directly from browser
   - Share medical documents securely
   - Receive digital prescriptions

### For Healthcare Providers

1. **🏥 Provider Registration**
   - Submit credentials for verification
   - Set up practice profile and availability

2. **📊 Dashboard Management**
   - View upcoming appointments
   - Access patient medical histories
   - Manage consultation schedules

3. **👨‍⚕️ Conduct Consultations**
   - Initiate secure video calls
   - Document consultation notes
   - Issue digital prescriptions

---

## 🎨 Figma Design

### 🎯 Design System & UI/UX

Our Telehealth platform follows a comprehensive design system created in Figma, ensuring consistency and excellent user experience across all touchpoints.

#### 📐 Design Files
- **🎨 [Main Design File](https://www.figma.com/design/Cfe8n7T3fWCiIWIuU1YuLR/ui?node-id=3-2&t=iNXnlaAdBn4k74Bu-1)** - Complete UI/UX designs

#### 🎨 Design Highlights
- **🎯 User-Centered Design** - Focused on healthcare accessibility
- **🌈 Modern Color Palette** - Professional yet approachable
- **📱 Responsive Layouts** - Optimized for all screen sizes
- **♿ Accessibility First** - WCAG 2.1 compliant designs
- **🔧 Component System** - Consistent UI elements throughout

#### 🖼️ Key Screens Designed
- 🏠 Landing Page & Hero Section
- 🔐 Authentication Flow (Login/Register)
- 👤 Patient & Doctor Dashboards
- 📅 Appointment Booking Interface
- 📞 Video Consultation UI

#### 🎨 How to Access Designs
1. **View Only Access**: Click the Figma links above
2. **Developer Handoff**: Use Figma Dev Mode for CSS extraction
3. **Asset Export**: Download icons, images, and other assets
4. **Design Specs**: Access detailed measurements and spacing

> **Note**: Design files are continuously updated. Check the Figma file for the latest iterations and design decisions.

---

## 🔐 Security

Security is our top priority in handling sensitive healthcare data:

- **🔒 Data Encryption** - All data encrypted in transit and at rest
- **🔐 Authentication** - JWT-based secure authentication
- **🛡️ Authorization** - Role-based access control (RBAC)
- **📋 HIPAA Compliance** - Following healthcare data protection standards
- **🔍 Input Validation** - Comprehensive input sanitization
- **🚫 Rate Limiting** - Protection against abuse and attacks
- **📊 Audit Logging** - Comprehensive activity logging

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🚀 Getting Started
1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **🔄 Open** a Pull Request

### 📋 Development Guidelines
- Follow existing code style and conventions
- Write clear, concise commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure HIPAA compliance for health-related features

### 🐛 Bug Reports
Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Telehealth Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Team

### 👨‍💻 Core Contributors

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/PriyanshuN19">
          <img src="https://github.com/PriyanshuN19.png" width="100px;" alt="Priyanshu"/>
          <br />
          <sub><b>Priyanshu Nailwal, Divya Nagpal and Arpit Sharma</b></sub>
        </a>
        <br />
        <sub>🚀 Lead Developers</sub>
      </td>
    </tr>
  </table>
</div>

### 🤝 Want to Join?
We're always looking for passionate developers, designers, and healthcare professionals to join our mission of making healthcare more accessible through technology.

---

<div align="center">
  <h3>🌟 Star this repository if you found it helpful!</h3>
  <p>Made with ❤️ for better healthcare accessibility</p>
  
  <img src="https://img.shields.io/github/stars/PriyanshuN19/telehealth?style=social" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/PriyanshuN19/telehealth?style=social" alt="GitHub forks" />
  <img src="https://img.shields.io/github/watchers/PriyanshuN19/telehealth?style=social" alt="GitHub watchers" />
</div>

---

<div align="center">
  <p><strong>🏥 Telehealth Platform - Connecting Care, Anywhere, Anytime</strong></p>
</div>
