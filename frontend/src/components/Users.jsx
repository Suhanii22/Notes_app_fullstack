

function Users({ token ,users, setUsers }) {

  // Function to upgrade user plan
  
  const upgradeUser = async (userId) => {
   
      const res = await fetch(`http://localhost:5000/api/users/${userId}/upgrade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to upgrade user");
        return;
      }

      // Updating the frontend state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, plan: "pro" } : user
        )
      );
   
  };


  return (
    <div>
      <h2>All Users (Same Tenant)</h2>
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (

          <div key={user._id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Plan: {user.plan}</p>

            {user.plan === "free" && (
              <button className="border p-1 m-1" onClick={() => upgradeUser(user._id)} style={{ marginLeft: 10 }}>Upgrade</button>
            )}
          </div>

        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default Users;
