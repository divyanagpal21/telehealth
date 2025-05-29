import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    // Check for token in localStorage when component mounts
    const token = localStorage.getItem('authToken');
    setHasToken(!!token);
  }, [isAuthenticated]); // Re-check when auth state changes

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    try {
      logout();
      localStorage.removeItem('authToken'); // Ensure token is removed
      setSnackbar({
        open: true,
        message: 'Logged out successfully',
        severity: 'success'
      });
      navigate("/login");
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error during logout. Please try again.',
        severity: 'error'
      });
      console.error('Logout error:', error);
    }
  };

  // Only show logout if we have both context auth state AND localStorage token
  const showLogout = isAuthenticated && hasToken;

  return (
    <div className="font-sans text-gray-800 flex flex-col">
      <header className="bg-gradient-to-r from-green-200 to-green-300 p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-green-800">📱 Telehealth</div>

        <nav className="flex gap-6">
          <button 
            onClick={() => handleNavigate("/")} 
            className="hover:text-green-800 hover:underline"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigate("/doctors")} 
            className="hover:text-green-800 hover:underline"
          >
            All Doctors
          </button>
          <button 
            onClick={() => handleNavigate("/contacts")} 
            className="hover:text-green-800 hover:underline"
          >
            Contacts
          </button>
        </nav>

        <div className="relative">
          {showLogout ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white text-green-800 px-4 py-2 rounded-full border border-green-600 hover:bg-green-50 transition-colors"
                aria-expanded={isDropdownOpen}
                aria-label="Account options"
              >
                Account
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-green-100 rounded-md shadow-lg z-50"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate("/signup")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                  >
                    Register
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => handleNavigate("/doctor-id")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                  >
                    Doctor Portal
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}