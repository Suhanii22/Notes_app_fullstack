import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Form({ token, onUserAdded, showNotification ,closeForm}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [plan, setPlan] = useState("free");
    const [tempPassword, setTempPassword] = useState("");
    const [tenants, setTenants] = useState([]);
    const [tenantId, setTenantId] = useState("");


    // fetching tenants 
    useEffect(() => {
        fetch(`${API_URL}/api/tenants`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setTenants(data);
            })
            
    }, []);

    const generatePassword = () => Math.random().toString(36).slice(-8);

    const handleSubmit = async (e) => {


        e.preventDefault();
        const randomPass = generatePassword();


        const res = await fetch(`${API_URL}/api/invite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                email,
                role,
                tenant: tenantId,
                plan,
                password: randomPass,

            }),
        });


        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create user");

        setTempPassword(randomPass);
     
        showNotification(`User created! Temp password: ${randomPass}`, "success",10000);

        // Reseting form
        setName("");
        setEmail("");
        setRole("member");
        setTenantId("");
        setPlan("free");

        // refetching Users();
        onUserAdded();
        closeForm();



    };


    return (
        <div className="w-[300px] bg-white shadow-2xl  p-4  rounded-2xl  mr-8 z-5" >

          
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                <input className="p-2 bg-[#edecec]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="p-2 bg-[#edecec]" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <select className="p-2 bg-[#edecec]" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>

                <select className="p-2 bg-[#edecec]" value={tenantId} onChange={(e) => setTenantId(e.target.value)} required>
                    <option value="">Select Tenant</option>
                    {tenants.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>




                <select className="p-2 bg-[#edecec]" value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                </select>

                <button className="p-2 bg-[#4c58c2] text-white" type="submit" style={{ padding: "5px", cursor: "pointer" }}>Create User</button>
            </form>


            {tempPassword && (
                <p style={{ marginTop: "10px", color: "green" }}>
                    Temporary Password: <strong>{tempPassword}</strong>
                </p>
            )}
        </div>
    );
}
