import './App.css'
import React, { useState } from 'react';
import { useEffect } from 'react';
import Login from './components/Login.jsx';
import Notes from './components/NotesPage.jsx';
import Users from './components/Users.jsx';
import Form from "./components/Form.jsx";




function App() {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [tenant, setTenant] = useState('');
    const [ShowInvite, setShowInvite] = useState(false);

    const [users, setUsers] = useState([]);
    const [showChangePass, setShowChangePass] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Fetch users
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users", {
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



    const handleUpdate = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/api/auth/change-password', {
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



    return (



        <div className='p-6'>

            {!token ? (
                <Login setToken={setToken} setRole={setRole} setTenant={setTenant} />
            ) : (
                <div>
                    <div className=' text-3xl text-center mb-10'>Welcome to Notes App</div>
                    <div>
                         {/* Button to toggle change password form */}
                            <button className='absolute right-4 border p-2 bg-gray-100 ' onClick={() => setShowChangePass(!showChangePass)}>
                                {showChangePass ? 'Cancel' : 'Change Password'}
                            </button>


                        <div>
                            <div className='border p-2 m-2 w-[300px]'>
                        <div>Tenant: {tenant}</div>
                        <div>Role: {role}</div>
</div>
                          
                            {/* Change password form */}
                            {showChangePass && (
                                <form  onSubmit={handleUpdate}>
                                    <div>
                                        <label>Current Password:</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>New Password:</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit">Update Password</button>
                                </form>
                            )}

                        </div>

                        <div className='border p-2 m-2' style={{ marginBottom: '20px' }}>
                            <Notes token={token} />
                        </div>



                        {role === 'admin' && (
                            <div className='border p-2 m-2'>
                                <Users  token={token} users={users} setUsers={setUsers} />

                            </div>)}


                        {role === "admin" && (
                            <button className='border p-2 m-2' onClick={handleToggleInvite}>
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
