
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Users({ token, users, setUsers, fetchUsers, setConfirm, showNotification }) {

  // upgrade user plan

  const upgradeUser = async (userId) => {

    const res = await fetch(`${API_URL}/api/users/${userId}/upgrade`, {
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


    // Updating the frontend state of upgraded  user 
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, plan: "pro" } : user
      )
    );

    showNotification("User upgraded to Pro plan successfully!", "success");


  };



  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Users updated:", users);
  }, [users]);



  return (
    // <div className="bg-white shadow-2xl ml-4 mr-4 p-4 mt-20 mb-20">
    //   <h2 className="text-2xl text-center p-6 mb-4  font-bold">All Users (Same Tenant)</h2>
    //   {Array.isArray(users) && users.length > 0 ? (
    //     users.map((user) => (

    //       <div key={user._id} className="bg-[#f3f2f2] rounded-2xl p-3 mb-2 w-1/3 min-w-52 m-auto  flex justify-between">
    //         <div> <p><span className="font-bold pr-2 pl-2 ">Name: </span><span>{user.name} </span></p>
    //           <p><span className="font-bold pr-2 pl-2 ">Email:</span><span>{user.email}</span></p>
    //           <p><span className="font-bold pr-2 pl-2 ">Role: </span><span>{user.role} </span></p>
    //           <p><span className="font-bold pr-2 pl-2 ">Plan: </span><span>{user.plan} </span></p>
    //         </div>
    //         <div>
    //           {user.plan === "free" && (
    //             <button
    //               onClick={() => {
    //                 setConfirm({
    //                   open: true,
    //                   message: "Upgrade this user to Pro plan?",
    //                   onConfirm: () => upgradeUser(user._id),
    //                 });
    //               }}
    //             >
    //               Upgrade
    //             </button>
    //           )}
    //         </div>
    //       </div>

    //     ))
    //   ) : (
    //     <p>No users found</p>
    //   )}
    // </div>



    
 
  <div className=" bg-white shadow-2xl p-4 mt-5 mb-5 max-h-[80vh] flex flex-col">
    <h2 className="text-2xl text-center p-4 font-bold">
      All Users (Same Tenant)
    </h2>

    {/* SCROLL AREA */}
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-2">
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-50 rounded-xl p-4 shadow flex justify-between items-center"
          >
            <div>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Role:</b> {user.role}</p>
              <p><b>Plan:</b> {user.plan}</p>
            </div>

            {user.plan === "free" && (
              <button
                onClick={() =>
                  setConfirm({
                    open: true,
                    message: "Upgrade this user to Pro plan?",
                    onConfirm: () => upgradeUser(user._id),
                  })
                }
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Upgrade
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No users found</p>
      )}
    </div>
  </div>


  );
}

export default Users;
