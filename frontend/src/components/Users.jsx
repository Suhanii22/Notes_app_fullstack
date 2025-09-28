

function Users({ token, users, setUsers }) {

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
    <div className="bg-white shadow-2xl ml-4 mr-4 p-4 mt-20 mb-20">
      <h2 className="text-2xl text-center p-6 mb-4  font-bold">All Users (Same Tenant)</h2>
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (

          <div key={user._id} className="bg-[#f3f2f2] rounded-2xl p-3 mb-2 w-1/3 min-w-52 m-auto  flex justify-between">
          <div> <p><span className="font-bold pr-2 pl-2 ">Name: </span><span>{user.name} </span></p>
            <p><span className="font-bold pr-2 pl-2 ">Email:</span><span>{user.email}</span></p>
            <p><span className="font-bold pr-2 pl-2 ">Role: </span><span>{user.role} </span></p>
            <p><span className="font-bold pr-2 pl-2 ">Plan: </span><span>{user.plan} </span></p>
            </div> <div>
            {user.plan === "free" && (
              <button className="text-green-700 border rounded-2xl p-2 m-1 " onClick={() => upgradeUser(user._id)} style={{ marginLeft: 10 }}>Upgrade</button>
            )}
            </div>
          </div>

        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default Users;
