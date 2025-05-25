import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ use the auth context

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login
  };

  return (
    <div className="font-sans text-gray-800 flex flex-col">
      <header className="bg-gradient-to-r from-green-200 to-green-300 p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-green-800">📱 Telehealth</div>

        <nav className="flex gap-6">
          <button onClick={() => handleNavigate("/")} className="hover:text-green-800">Home</button>
          <button onClick={() => handleNavigate("/doctors")} className="hover:text-green-800">All Doctors</button>
          <button onClick={() => handleNavigate("/contacts")} className="hover:text-green-800">Contacts</button>
        </nav>

        <div className="relative">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white text-green-800 px-4 py-2 rounded-full border border-green-600 hover:bg-green-100"
              >
                Create account
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-50">
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate("/signup")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-100"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => handleNavigate("/doctor-id")}
                    className="block w-full text-left px-4 py-2 hover:bg-green-100"
                  >
                    Doctor ID
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </div>
  );
}
