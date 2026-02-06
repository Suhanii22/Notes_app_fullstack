import React from "react";

export default function Notification({ message, type = "info", onClose }) {
  if (!message) return null;



  return (
    <div
      className={` bg-[#fcf8f8]  p-4 rounded shadow fixed top-5 left-1/3  z-50 min-w-[250px]`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold">X</button>
      </div>
    </div>
  );
}
