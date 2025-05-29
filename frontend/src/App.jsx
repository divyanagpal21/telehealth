import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import TelehealthUI from './components/Home';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import Login from './Pages/Login';
// import RegisterPage from './components/RegisterPage';
import Dashboard from './Pages/Dashboard';
import SignUp from './pages/SignUp';
import AllDoctors from './Pages/AllDoctors';
import DoctorProfile from './components/DoctorProfile';
import AppointmentConfirmation from './Pages/AppointmentConfirmation';
import DeepgramTranscriber from './Pages/Chat'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TelehealthUI />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
       
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/doctors" element={<AllDoctors />} />
        <Route path="/chats" element={<DeepgramTranscriber/>} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
       <Route path="/appointment-confirmation" element={<AppointmentConfirmation />} />

      </Routes>
    </>
  );
}

export default App;
