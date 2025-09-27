import { useState, useEffect } from "react";

export default function Form({ token , onUserAdded}) {//UserInvite
    //   const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [plan, setPlan] = useState("free");
    const [tempPassword, setTempPassword] = useState("");
    const [tenants, setTenants] = useState([]);
    const [tenantId, setTenantId] = useState("");
  

    // fetching tenants 
    useEffect(() => {
        fetch("http://localhost:5000/api/tenants")
            .then(res => res.json())
            .then(data => {
            // console.log("Fetched tenants:", data); 
            setTenants(data);
        })
            .catch(err => console.error(err));
    }, []);

    const generatePassword = () => Math.random().toString(36).slice(-8);

    const handleSubmit = async (e) => {
       

        e.preventDefault();
        const randomPass = generatePassword();

      
            const res = await fetch("http://localhost:5000/api/invite", {
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
            alert(`User created! Temporary password: ${randomPass}`);

            // Reseting form
            setName("");
            setEmail("");
            setRole("member");
            setTenantId("");
            setPlan("free");

            // refetching Users();
             onUserAdded();
      
    };


    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
        
            {/* {showForm && ( */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>

                <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} required>
                    <option value="">Select Tenant</option>
                    {tenants.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>




                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                </select>

                <button type="submit" style={{ padding: "5px", cursor: "pointer" }}>Create User</button>
            </form>
            

            {tempPassword && (
                <p style={{ marginTop: "10px", color: "green" }}>
                    Temporary Password: <strong>{tempPassword}</strong>
                </p>
            )}
        </div>
    );
}
