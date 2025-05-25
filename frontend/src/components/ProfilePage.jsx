// ProfilePage.js
import React, { useState } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "Avinash Kr",
    contact: {
      email: "test@gmail.com",
      phone: "0000000000",
      address: "AECS Layout",
      city: "Whitefield, BLR, KA"
    },
    basicInfo: {
      gender: "Male",
      birthday: "1993-01-01"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{profileData.name}</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">CONTACT INFORMATION</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email id:</p>
            <p>{profileData.contact.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone:</p>
            <p>{profileData.contact.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">Address:</p>
            <p>{profileData.contact.address}</p>
          </div>
          <div>
            <p className="text-gray-600">City:</p>
            <p>{profileData.contact.city}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">BASIC INFORMATION</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Gender:</p>
            <p>{profileData.basicInfo.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Birthday:</p>
            <p>{profileData.basicInfo.birthday}</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleEdit}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
      >
        {isEditing ? 'Save Changes' : 'Edit'}
      </button>
    </div>
  );
};

export default ProfilePage;