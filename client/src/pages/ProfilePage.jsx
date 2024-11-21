import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import ParticlesComponent from "./ParticlesComponent"; // Import the ParticlesComponent
import './ProfilePage.css'; // Import any additional CSS if needed

const ProfilePage = () => {
  const { authUser  , isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeMessage, setActiveMessage] = useState(""); // State to track active status

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Handle particle interaction events
  const handleParticlesClick = () => {
    setActiveMessage("Particles are repulsing!"); // Update active message on click
    setTimeout(() => setActiveMessage(""), 2000); // Clear message after 2 seconds
  };

  const handleParticlesHover = () => {
    setActiveMessage("Hovering over particles!"); // Update active message on hover
    setTimeout(() => setActiveMessage(""), 2000); // Clear message after 2 seconds
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Particles background */}
      <ParticlesComponent
        id="tsparticles"
        onClick={handleParticlesClick} // Attach click event
        onHover={handleParticlesHover} // Attach hover event
      />
      <div className="max-w-2xl mx-auto p-6 py-10 bg-white shadow-lg rounded-lg relative z-10 mt-24"> {/* Increased margin-top */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Profile</h1>
          <p className="mt-2 text-gray-600">Your profile information</p>
        </div>

        {/* Active message display */}
        {activeMessage && (
          <div className="absolute top-5 left-5 text-white bg-black bg-opacity-50 p-2 rounded-md">
            {activeMessage}
          </div>
        )}

        {/* Avatar upload section */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="relative">
            <img
              src={selectedImg || authUser .profilePic || "/avatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 shadow-md"
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-blue-600 hover:bg-blue-700 
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <div className="space-y-1">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <User  className="w-5 h-5 text-gray-500" />
              Full Name
            </div>
            <p className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">{authUser .fullName}</p>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="w-5 ```javascriptreact
              h-5 text-gray-500" />
              Email Address
            </div>
            <p className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">{authUser  .email}</p>
          </div>
        </div>

        {/* Account Information Section moved after Email Address */}
        <div className="mt-6 bg-white rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-300">
              <span>Member Since</span>
              <span>{authUser  .createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;