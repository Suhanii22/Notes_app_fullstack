import React, { useState, useEffect, useCallback } from "react";


function NotesPage({ token, currentUserId, currentUserPlan }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [myNotes, setMyNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  // Fetching My Notes
  const fetchMyNotes = useCallback(async () => {

    const res = await fetch("http://localhost:5000/api/notes/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyNotes(data);

  }, [token]);

  // Fetching All Notes of Tenant
  const fetchAllNotes = useCallback(async () => {

    const res = await fetch("http://localhost:5000/api/notes/all", {
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


    const res = await fetch("http://localhost:5000/api/notes", {
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

  };

  // Delete Note
  const handleDelete = async (id) => {

    await fetch(`http://localhost:5000/api/notes/${id}`, {
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


    const res = await fetch(`http://localhost:5000/api/notes/${note._id}`, {
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

  return (
    <div>



      {/* create note */}
      <div className="w-1/2 m-auto p-2" >

        <h2 className="m-1 text-center text-2xl font-bold p-2">Create a Note</h2>
        <div className='  p-2 m-1 mb-6 shadow-2xl bg-[#ffffff]'> 
         <input
         className=" p-2 bg-[#f9f8f8]" 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "5px" }}
         />
          <textarea
          className=" p-2 bg-[#f9f8f8]"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <div className='bg-[#4c58c2] w-[100px] m-auto text-white p-2 m-1'>
            <button className="w-[90px] text-center" onClick={createNote}>Add Note</button>
          </div>
        </div>



      </div>

      <div className=" bg-[#ffffff] shadow-gray shadow-2xl mt-10 flex  justify-center p-4">



        {/* mynotes */}
        <div className="w-1/2 ">
          <div className=" text-center p-2 text-2xl mb-6  font-bold">My Notes</div>
          <div className="">
            {myNotes.map((note) => (
              <div key={note._id} className='rounded-2xl bg-[#f4f4f4] p-3 m-6 ml-10 mr-10' >
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                <small>{new Date(note.createdAt).toLocaleString()}</small>
                <div className="flex gap-2">
                  <div className=" p-1 bg-[#cac9c9] pl-3 pr-3 mt-3 rounded-xl text-sm m-1"> <button onClick={() => handleEdit(note)}>Edit</button></div>
                  <div className=" p-1 bg-[#cac9c9] pl-3 pr-3 mt-3 rounded-xl text-sm m-1"><button onClick={() => handleDelete(note._id)}>Delete</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* all notes */}
        <div className="w-1/2 ">
         <div className=" text-center p-2 text-2xl mb-6  font-bold"><h2>All Notes (Tenant)</h2></div> 
         
         <div className=''> {allNotes.map((note) => (
            <div key={note._id}  className='rounded-2xl bg-[#f4f4f4] p-3 m-6 ml-10 mr-10'>
              <h4>{note.title}</h4>
              <p>{note.content}</p>

              <small>{note.user?.name} - {new Date(note.createdAt).toLocaleString()}</small>


              {(note.user === currentUserId &&
                <div>
                  < button onClick={() => handleEdit(note)}>Edit</button>
                  < button onClick={() => handleDelete(note._id)}>Delete</button>
                </div>
              )}

            </div>
          ))}
          </div>



        </div>

      </div>

    </div>
  );
}

export default NotesPage;
