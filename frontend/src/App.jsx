import './App.css'
import React, { useState } from 'react';
import { useEffect } from 'react';
import Login from './components/Login.jsx';
import Notes from './components/NotesPage.jsx';
import Users from './components/Users.jsx';
import Form from "./components/Form.jsx";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";


const API_URL = import.meta.env.VITE_API_URL;




function App() {

// const [token, setToken] = useState('');
//   const [currentUserId, setCurrentUserId] = useState('');
//   const [currentUserPlan, setCurrentUserPlan] = useState('');




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


      // decode token whenever it changes
//   useEffect(() => {
//     if (token) {
//       const decoded = jwtDecode(token);
//       setCurrentUserId(decoded.id);
//       setCurrentUserPlan(decoded.plan);
//     }
//   }, [token]);


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
        fetchUsers();
    }, [token]);



    useEffect(() => {
       
         if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
      setCurrentUserPlan(decoded.plan);
    }
    }, [token]);





    const handleUpdate = async (e) => {
        e.preventDefault();

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
            setCurrentPassword('');
            setNewPassword('');
            setTimeout(() => {

                setShowChangePass(false);
            }, 1000);
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




    return (



        <div className='bg-[#e6e5e5]'>
           { console.log(API_URL) }
            

            {!token ? (
                <Login setToken={setToken} setRole={setRole} setTenant={setTenant} />
            ) : (
                <div className=''>
                    <div className=' text-4xl font-bold  mb-10 p-8 bg-[#b1b5cb] '>Notes App</div>
                    <div className='p-6'>


                      
                    <button
                        className="absolute top-16 right-6 p-2 bg-red-500 text-white rounded"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>



                        {/* Button to toggle change password form */}
                        <button className='absolute   right-6 top-[114px] text-blue-500 pl-2 pr-2 ' onClick={() => setShowChangePass(!showChangePass)}>
                            {showChangePass ? 'Cancel' : 'Change Password'}
                        </button>


                        <div>
                            <div className='p-2  m-2 w-[200px]  mb-10 flex flex-col absolute top-0 right-0 gap-2'>
                                <div> <span className='font-bold pr-2 text-2xl'>Tenant:</span><span className='text-xl'> {tenant}</span></div>
                                <div><span  className='font-bold pr-2 text-2xl'>Role:</span><span   className='text-xl'> {role}    </span></div>
                            </div>

                            {/* Change password form */}
                            {showChangePass && (
                                <form className='rounded shadow-2xl bg-[#ffffff] flex flex-col  w-[300px] p-2 absolute right-6 top-[150px] z-3' onSubmit={handleUpdate}>
                                    <div className='ml-12 mr-12' >
                                        <label className='pl-4'>Current Password:</label>
                                        <input
                                        className='border'
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className='ml-12 mr-12'>
                                        <label  className='pl-8'>New Password:</label>
                                        <input
                                        className='border'
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button className='border w-[150px] mt-4 p-1 bg-[#1a51dd] m-auto text-white'  type="submit">Update Password</button>
                                </form>
                            )}

                        </div>

                        <div className=' p-2 m-2' style={{ marginBottom: '20px' }}>
                            <Notes token={token} currentUserId={currentUserId} currentUserPlan={currentUserPlan} />
                        </div>



                        {role === 'admin' && (
                            <div className=''>
                                <Users token={token} users={users} setUsers={setUsers} />

                            </div>)}


                        {role === "admin" && (
                            <button className='text-blue-500 p-2 m-2 absolute top-[140px] right-[20px] ' onClick={handleToggleInvite}>
                                {ShowInvite ? "Close Invite Form" : "Invite User"}
                            </button>
                        )}


                        {ShowInvite && <Form token={token} onUserAdded={fetchUsers} />}


                    </div>



                </div>

            )}
        </div>

    );
}

export default App;
