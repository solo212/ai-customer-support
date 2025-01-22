"use client";

import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

const GoogleSignInButton = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      alert("Signed in successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error signing in: ", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <button
      onClick={handleSignIn}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4285F4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;



