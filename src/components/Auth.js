import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const { signIn, signUp, confirmSignUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (needsVerification) {
      const success = await confirmSignUp(
        email,
        verificationCode,
        tempPassword
      );
      if (success) {
        setNeedsVerification(false);
      }
      return;
    }

    if (isLogin) {
      await signIn(email, password);
    } else {
      const success = await signUp(email, password, name);
      if (success) {
        setTempPassword(password);
        setNeedsVerification(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

        {needsVerification ? (
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <p className="helper-text">
              Please check your email for the verification code
            </p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <button type="submit">
          {needsVerification ? "Verify Email" : isLogin ? "Sign In" : "Sign Up"}
        </button>

        {!needsVerification && (
          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="link-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default Auth;
