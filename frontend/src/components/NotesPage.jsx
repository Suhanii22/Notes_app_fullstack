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
    <div style={{ display: "flex", gap: "40px" }}>
      {/* Left Column: My Notes */}
      <div style={{ flex: 1 }}>
        <h2 className="m-1">My Notes</h2>
        <div >
         <div className='border p-2 m-1'> <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          </div>
          <div className='border p-2 m-1'>
          <button onClick={createNote}>Add Note</button>
        </div></div>
        <div >
          {myNotes.map((note) => (
            <div className='border p-2 m-2' key={note._id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <div className="flex gap-2">
              <div className="border pl-2 pr-2 rounded-xl text-sm m-1"> <button onClick={() => handleEdit(note)}>Edit</button></div> 
              <div className="border pl-2 pr-2 rounded-xl text-sm m-1"><button onClick={() => handleDelete(note._id)}>Delete</button></div> 
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: All Tenant Notes */}
      <div style={{ flex: 1 }}>
        <h2>All Notes (Tenant)</h2>
        <div >
          {allNotes.map((note) => (
            <div className='border p-2 m-2' key={note._id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
             
                
    <small>{note.user?.name} - {new Date(note.createdAt).toLocaleString()}</small>
            
            {( note.user === currentUserId && 
                <div>
                 < button className="border-2" onClick={() => handleEdit(note)}>Edit</button>
                 < button onClick={() => handleDelete(note._id)}>Delete</button>
                </div>
          )}
              
            </div>
          ))}

         

        </div>
      </div>
    </div>
  );
}

export default NotesPage;
