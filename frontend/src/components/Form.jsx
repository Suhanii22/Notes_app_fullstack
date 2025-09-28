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
        fetch(" https://notes-app-lszv.onrender.com/api/tenants")
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

      
            const res = await fetch(" https://notes-app-lszv.onrender.com/api/invite", {
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
        // style={{ maxWidth: "400px", margin: "20px auto", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}
        <div className="w-[300px] bg-white shadow-2xl  p-4  rounded-2xl absolute right-0 top-[200px] mr-8 z-5" >
        
            {/* {showForm && ( */}
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
