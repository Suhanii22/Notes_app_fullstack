import React, { useState } from 'react';



function Login({ setToken, setRole, setTenant }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const login = async () => {
    // console.log(email);
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },


      body: JSON.stringify({ email, password })
    });
    console.log("hii")

    const data = await res.json();
    if (!res.ok) {
      console.error("Login failed");
      return;
    }
    console.log(data)

    if (data.token) {
      setToken(data.token);
      setRole(data.role);
      setTenant(data.tenant);
      console.log(data.tenant)
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className='border-2 rounded-2xl p-10 flex flex-col items-center w-[500px] m-auto bg-blue-50' ><div>
      <h3 className='text-3xl font-bold text-center pb-[50px] pt-[30px]'>Login Here</h3></div>
      <div className='flex flex-col justify-center items-center w-[400px] gap-3 p-6'>
        <div>   <input className='border-2 bg-gray-100  border-gray-500 h-10 w-[300px] pl-2' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div> <input   className='border-2 bg-gray-100 border-gray-500 h-10 w-[300px] pl-2' placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div>   <button className='w-[150px] bg-blue-600 text-white text-xl m-8 h-12 border-2 border-gray-500' onClick={login}>Login</button></div>
      </div>
    </div>
  );
}

export default Login;
