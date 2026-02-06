import React, { useState, useEffect, useCallback } from "react";
const API_URL = import.meta.env.VITE_API_URL;


function NotesPage({ token, currentUserId, currentUserPlan, setConfirm }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [myNotes, setMyNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
const [showCreate, setShowCreate] = useState(false);



  // Fetching My Notes
  const fetchMyNotes = useCallback(async () => {

    const res = await fetch(`${API_URL}/api/notes/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyNotes(data);

  }, [token]);

  // Fetching All Notes of Tenant
  const fetchAllNotes = useCallback(async () => {

    const res = await fetch(`${API_URL}/api/notes/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAllNotes(data);

  }, [token]);

  useEffect(() => {
    fetchMyNotes();
    fetchAllNotes();
  }, [fetchMyNotes, fetchAllNotes]);

  // Createing Note with Plan Limit
  const createNote = async () => {
    if (currentUserPlan === "free" && myNotes.length >= 3) {
      alert("Free plan allows only 3 notes");
      setTitle("");
      setContent("");
      return;
    }


    const res = await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      setTitle("");
      setContent("");
      return;
    }

    setMyNotes([data, ...myNotes]);
    setAllNotes([data, ...allNotes]);
    setTitle("");
    setContent("");
    

      setShowCreate(false);

  };

  // Delete Note
  const handleDelete = async (id) => {

    await fetch(`${API_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyNotes(myNotes.filter((n) => n._id !== id));
    setAllNotes(allNotes.filter((n) => n._id !== id));

  };

  // Edit Note
  const handleEdit = async (note) => {
    const newTitle = prompt("New title", note.title);
    const newContent = prompt("New content", note.content);

    if (!newTitle || !newContent) return;


    const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    const updatedNote = await res.json();
    setMyNotes(myNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
    setAllNotes(allNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n)));

  };



  // const [showCreate, setShowCreate] = useState(false);



  //  const createNote = () => {
  //   if (!title || !content) return;
  //   const newNote = { _id: Date.now(), title, content, user: currentUserId, createdAt: new Date() };
  //   setMyNotes([newNote, ...myNotes]);
  //   setAllNotes([newNote, ...allNotes]);
  //   setTitle("");
  //   setContent("");
  //   setShowCreate(false);
  // };





  return (


    // <div>



    //   {/* create note */}
    //   <div className="w-1/2 m-auto p-2" >

    //     <h2 className="m-1 text-center text-2xl font-bold p-2">Create a Note</h2>
    //     <div className='  p-2 m-1 mb-6 shadow-2xl bg-[#ffffff]'>
    //       <input
    //         className=" p-2 bg-[#f9f8f8]"
    //         placeholder="Title"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         style={{ width: "100%", marginBottom: "5px" }}
    //       />
    //       <textarea
    //         className=" p-2 bg-[#f9f8f8]"
    //         placeholder="Content"
    //         value={content}
    //         onChange={(e) => setContent(e.target.value)}
    //         style={{ width: "100%", marginBottom: "5px" }}
    //       />
    //       <div className='bg-[#4c58c2] w-[100px] m-auto text-white p-2 m-1'>
    //         <button className="w-[90px] text-center" onClick={createNote}>Add Note</button>
    //       </div>
    //     </div>



    //   </div>

    //   <div className=" bg-[#ffffff] shadow-gray shadow-2xl mt-10 flex  justify-center p-4">



    //     {/* mynotes */}
    //     <div className="w-1/2 ">
    //       <div className=" text-center p-2 text-2xl mb-6  font-bold">My Notes</div>
    //       <div className="">
    //         {myNotes.map((note) => (
    //           <div key={note._id} className='rounded-2xl bg-[#f4f4f4] p-3 m-6 ml-10 mr-10' >
    //             <h4>{note.title}</h4>
    //             <p>{note.content}</p>
    //             <small>{new Date(note.createdAt).toLocaleString()}</small>
    //             <div className="flex gap-2">
    //               <div className=" p-1 bg-[#cac9c9] pl-3 pr-3 mt-3 rounded-xl text-sm m-1"> <button onClick={() => handleEdit(note)}>Edit</button></div>
    //               <div className=" p-1 bg-[#cac9c9] pl-3 pr-3 mt-3 rounded-xl text-sm m-1"><button onClick={() => handleDelete(note._id)}>Delete</button></div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>


    //     {/* all notes */}
    //     <div className="w-1/2 ">
    //       <div className=" text-center p-2 text-2xl mb-6  font-bold"><h2>All Notes (Tenant)</h2></div>

    //       <div className=''> {allNotes.map((note) => (
    //         <div key={note._id} className='rounded-2xl bg-[#f4f4f4] p-3 m-6 ml-10 mr-10'>
    //           <h4>{note.title}</h4>
    //           <p>{note.content}</p>

    //           <small>{note.user?.name} - {new Date(note.createdAt).toLocaleString()}</small>


    //           {(note.user === currentUserId &&
    //             <div>
    //               < button onClick={() => handleEdit(note)}>Edit</button>

                 
    //               <button
    //                 onClick={() => {
    //                   setConfirm({
    //                     open: true,
    //                     message: "This note will be permanently deleted. Continue?",
    //                     onConfirm: () => deleteNote(note._id),
    //                   });
    //                 }}
    //               >
    //                 Delete
    //               </button>
    //             </div>
    //           )}

    //         </div>
    //       ))}
    //       </div>



    //     </div>

    //   </div>

    // </div>



//      <div className="min-h-screen bg-gray-100 p-6">

//       {/* Create Note Section */}
//      <div className="flex justify-center mb-10">
//   <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
//     <h2 className="text-2xl font-bold text-center">Create a Note</h2>
//     <input
//       className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//       placeholder="Title"
//       value={title}
//       onChange={(e) => setTitle(e.target.value)}
//     />
//     <textarea
//       className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//       placeholder="Content"
//       value={content}
//       onChange={(e) => setContent(e.target.value)}
//       rows={3}
//     />
//     <button
//       onClick={createNote}
//       className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
//     >
//       Add Note
//     </button>
//   </div>
// </div>

//       {/* Notes Lists */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

//         {/* My Notes */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4 text-center">My Notes</h2>
//           <div className="space-y-4">
//             {myNotes.map((note) => (
//               <div key={note._id} className="bg-white shadow rounded-lg p-4 space-y-2">
//                 <h4 className="font-semibold text-lg">{note.title}</h4>
//                 <p className="text-gray-700">{note.content}</p>
//                 <small className="text-gray-400">{new Date(note.createdAt).toLocaleString()}</small>
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
//                     onClick={() => handleEdit(note)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                     onClick={() => handleDelete(note._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* All Notes */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4 text-center">All Notes (Tenant)</h2>
//           <div className="space-y-4">
//             {allNotes.map((note) => (
//               <div key={note._id} className="bg-white shadow rounded-lg p-4 space-y-2">
//                 <h4 className="font-semibold text-lg">{note.title}</h4>
//                 <p className="text-gray-700">{note.content}</p>
//                 <small className="text-gray-400">{note.user?.name} - {new Date(note.createdAt).toLocaleString()}</small>

//                 {note.user?._id === currentUserId && (
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
//                       onClick={() => handleEdit(note)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                       onClick={() => setConfirm({
//                         open: true,
//                         message: "This note will be permanently deleted. Continue?",
//                         onConfirm: () => deleteNote(note._id)
//                       })}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>


  <div className="flex min-h-screen gap-4 p-4 bg-gray-100">
      
      {/* Floating Create Note Card */}
      {/* <div className={`fixed top-20 right-10 w-80 bg-white shadow-2xl rounded-xl p-4 transition-transform ${showCreate ? "translate-y-0" : "-translate-y-96"}`}> */}
        
     {showCreate && (
  <div className="fixed top-20 right-10 w-80 bg-white shadow p-4 rounded transition duration-300">
    <h2 className="text-xl font-bold mb-2">Create Note</h2>
    <input
      className="border p-2 mb-2 w-full rounded"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <textarea
      className="border p-2 mb-2 w-full rounded"
      placeholder="Content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
    <button
      onClick={createNote}
      className="bg-blue-600 text-white p-2 rounded w-full"
    >
      Add Note
    </button>
  </div>
)}


      {/* Toggle button for Create Note */}
      <button
        onClick={() => setShowCreate(prev => !prev)}
        className="fixed top-6 right-10 bg-purple-600 text-white p-2 rounded shadow-lg"
      >
        {showCreate ? "Close Note" : "New Note"}
      </button>

      {/* Left Panel - My Notes */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4">My Notes</h2>
        {myNotes.length === 0 && <p className="text-gray-400">No notes yet.</p>}
        {myNotes.map((note) => (
          <div key={note._id} className="border p-3 rounded-lg mb-3 bg-gray-50 shadow-sm">
            <h3 className="font-semibold">{note.title}</h3>
            <p>{note.content}</p>
            <div className="text-xs text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString()}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(note)} className="text-blue-500 text-sm">Edit</button>
              <button onClick={() => handleDelete(note._id)} className="text-red-500 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - All Notes */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4">All Notes (Tenant)</h2>
        {allNotes.length === 0 && <p className="text-gray-400">No tenant notes yet.</p>}
        {allNotes.map((note) => (
          <div key={note._id} className="border p-3 rounded-lg mb-3 bg-gray-50 shadow-sm">
            <h3 className="font-semibold">{note.title}</h3>
            <p>{note.content}</p>
            <div className="text-xs text-gray-500 mt-1">
  {note.user?.name} - {new Date(note.createdAt).toLocaleString()}
</div>

{note.user?._id === currentUserId && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(note)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(note._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>



  );
}

export default NotesPage;
