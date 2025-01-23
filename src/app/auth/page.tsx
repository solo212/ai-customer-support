"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase"; 
import GoogleSignInButton from "../../components/GoogleSignInButton";

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <h1>Sign In</h1>
      <GoogleSignInButton />
    </div>
  );
};

export default AuthPage;
