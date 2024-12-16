import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await authService.getCurrentAuthUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const result = await authService.signUpUser(email, password, name);
      if (result.user) {
        addToast("Sign up successful!", "success");
      } else {
        addToast("Verification code sent to your email", "success");
      }
      return true;
    } catch (error) {
      addToast(error.message, "error");
      return false;
    }
  };

  const confirmSignUp = async (email, code) => {
    try {
      await authService.confirmSignUpUser(email, code);
      addToast("Email verified successfully", "success");
      return true;
    } catch (error) {
      addToast(error.message, "error");
      return false;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await authService.signInUser(email, password);
      if (result?.user) {
        const userData = await authService.getCurrentAuthUser();
        setUser(userData);
        addToast("Signed in successfully", "success");
        return true;
      }
      return false;
    } catch (error) {
      addToast(error.message, "error");
      return false;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOutUser();
      setUser(null);
      addToast("Signed out successfully", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const value = {
    user,
    loading,
    signUp,
    confirmSignUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
