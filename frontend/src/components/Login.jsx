import React, { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;



function Login({ setToken, setRole, setTenant, showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const login = async (e) => {

    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },


        body: JSON.stringify({ email, password })
      });
      console.log("hii")

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "Login failed", "error");
        return;
      }
      console.log(data)

      if (data.token) {
        setToken(data.token);
        setRole(data.role);
        setTenant(data.tenant);
        console.log(data.tenant)
      } else {
        showNotification("Login failed", "error");
      }

    } catch (err) {
      // network/server error
      showNotification("Unable to reach the server. Try again.", "error");
    }
  };






  return (
    <div className='p-10 pb-30'>
      <div className='text-center'>
        You can use these details for login :<br/>
        Email : admin@globex.test<br/>
        Pass : password
        
      </div>
      <div className='  shadow-gray-500 shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[500px] m-auto mt-10 bg-[#f0f0f0] ' >
        <div>
          <h3 className='text-3xl font-bold text-center pb-[10px] pt-[30px]'>Login to your account</h3></div>
        <div className='pb-[40px]'>To Get Started</div>
        <div className='flex flex-col justify-center items-center w-[400px] gap-3 p-6'>
          <div> <  input className='border-1 bg-[#fffbfb]  border-gray-500 h-10 w-[300px] pl-2' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> </div>
          <div>< input className='border-1 bg-[#fffbfb] border-gray-500 h-10 w-[300px] pl-2' placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /> </div>
          <div>   <button className='w-[150px] rounded-2xl  bg-blue-600 text-white text-xl m-8 h-12 border-2 border-gray-500' onClick={login}>Login</button></div>
        </div>
      </div>

    </div>
  );
}

export default Login;
