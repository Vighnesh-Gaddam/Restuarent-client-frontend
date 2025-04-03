import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, deleteUserAPI } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Update user profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateUserProfile({ name: user.name, phone: user.phone });
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This action is irreversible!")) return;
    try {
      await deleteUserAPI();
      navigate("/"); // Redirect after deletion
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Profile</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!editMode}
          className={`w-full px-4 py-2 border rounded-md ${editMode ? "bg-white" : "bg-gray-100"}`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Phone</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          disabled={!editMode}
          className={`w-full px-4 py-2 border rounded-md ${editMode ? "bg-white" : "bg-gray-100"}`}
        />
      </div>

      <div className="flex justify-between">
        {editMode ? (
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
