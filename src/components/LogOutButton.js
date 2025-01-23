import React from "react";
import { getAuth, signOut } from "firebase/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
