import './App.css'
import React, { useState } from 'react';
import { useEffect } from 'react';
import Login from './components/Login.jsx';
import Notes from './components/NotesPage.jsx';
import Users from './components/Users.jsx';
import Form from "./components/Form.jsx";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import ConfirmModal from './components/ConfirmModal.jsx';
import Notification from './components/Notification.jsx';



const API_URL = import.meta.env.VITE_API_URL;




function App() {

  const [activeSection, setActiveSection] = useState('notes'); // default



  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [tenant, setTenant] = useState('');

  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserPlan, setCurrentUserPlan] = useState('');

  const [ShowInvite, setShowInvite] = useState(false);

  const [users, setUsers] = useState([]);
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });


  //motifications setting
  const [notification, setNotification] = useState({ message: "", type: "info" });

  const showNotification = (message, type = "info", duration = 3000) => {
    setNotification({ message, type });

    // auto-close after duration
    setTimeout(() => {
      setNotification({ message: "", type });
    }, duration);
  };



  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.id);
    setCurrentUserPlan(decoded.plan);

    showNotification("Logged in successfully!", "success");
  }, [token]);





  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (data.message) {
        showNotification(data.message, "success");
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {

          setShowChangePass(false);
        }, 1000);
      } else if (data.error) {
        showNotification(data.error, "error");
      }
    } catch (err) {
      showNotification("Something went wrong", "error");
    }
  };



  const handleToggleInvite = () => {
    setShowInvite(prev => !prev); //toggle
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    setTenant('');
    setCurrentUserId('');
    setCurrentUserPlan('');
    console.log("token is cleared")
  };






  // --- Dashboard Layout ---
  if (!token) return <Login setToken={setToken} setRole={setRole} setTenant={setTenant} showNotification={showNotification} />;




  return (


    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-55 bg-[#f6f6f6] flex flex-col p-6 gap-4">
        <h1 className="text-3xl font-bold mb-8">Notes App</h1>

        <div><strong>Tenant:</strong> {tenant}</div>
        <div><strong>Role:</strong> {role}</div>

        {/* Section Buttons */}
        <button
          className={`p-2 rounded ${activeSection === 'notes' ? 'bg-[#dfdbdb]' : ''}`}
          onClick={() => setActiveSection('notes')}
        >
          Notes
        </button>
        <button
          className={`p-2 rounded ${activeSection === 'users' ? 'bg-[#dfdbdb]' : 'bg-[#f7f7f7]'}`}

          onClick={() => setActiveSection('users')}
        >
          Users
        </button>

        {/* Existing buttons */}
        <button
          className="bg-[#f7f7f7]  p-2 rounded"
          onClick={() => {
            setConfirm({
              open: true,
              message: "Are you sure you want to logout?",
              onConfirm: handleLogout,
            });
          }}
        >
          Logout
        </button>



        <button
          className=" p-2 rounded"
          onClick={() => setShowChangePass(prev => !prev)}
        >
          {showChangePass ? "Cancel Password" : "Change Password"}
        </button>

        {role === "admin" && (
          <button
            className="p-2 rounded"
            onClick={handleToggleInvite}
          >
            {ShowInvite ? "Close Invite Form" : "Invite User"}
          </button>
        )}

      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-[#ececec]">
        {/* Notification */}
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, message: "" })}
        />

        {/* Change Password Form */}
        {showChangePass && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-md">
            {/* Change Password Modal */}
            {showChangePass && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white shadow-lg rounded-lg p-6 w-[400px]">
                  <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                    <div>
                      <label>Current Password:</label>
                      <input
                        className="border w-full p-2"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label>New Password:</label>
                      <input
                        className="border w-full p-2"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button className="bg-blue-600 text-white p-2 rounded mt-2" type="submit">
                      Update Password
                    </button>
                    <button
                      onClick={() => setShowChangePass(false)}
                      className="mt-2 w-full border p-2 rounded text-gray-700"
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Conditional content */}
        {activeSection === 'notes' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Notes</h2>
            <Notes token={token} currentUserId={currentUserId} currentUserPlan={currentUserPlan} setConfirm={setConfirm} />
          </div>
        )}

        {activeSection === 'users' && role === 'admin' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <Users
              token={token}
              users={users}
              setUsers={setUsers}
              fetchUsers={fetchUsers}
              setConfirm={setConfirm}
              showNotification={showNotification}
            />
          </div>
        )}

        {/* Invite Form */}
        {/* Invite User Modal */}

        {ShowInvite && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
            onClick={() => setShowInvite(false)} // click on overlay closes
          >
            <div
              className="relative bg-white p-4 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside form
            >
              {/* Close button */}
              <button
                className="absolute top-0 right-0 m-2 text-gray-500 hover:text-black font-bold text-xl"
                onClick={() => setShowInvite(false)}
              >
                ×
              </button>

              {/* Form component */}
              <Form
                token={token}
                onUserAdded={() => {
                  fetchUsers();         // refresh users
                  setShowInvite(false); // close modal after successful invite
                }}
                showNotification={showNotification}
              />
            </div>
          </div>
        )}



      </main>
    </div>

  );
}





export default App;
