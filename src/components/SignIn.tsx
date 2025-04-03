import { useState, useRef, useEffect } from "react";
import { useUser } from "../contexts/UserContext";

export const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp, resetPassword } = useUser();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await signUp(username, password);
      } else {
        await signIn(username, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleResetPassword = async () => {
    if (!username) {
      setError("Please enter your email address");
      return;
    }
    try {
      await resetPassword(username);
      setError("");
      alert("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error sending reset email",
      );
    }
  };

  return (
    <div className="sign-in">
      <h3>{isSignUp ? "Sign Up" : "Login here"}</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          ref={emailInputRef}
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        {!isSignUp && (
          <button
            type="button"
            className="forgot-password"
            onClick={handleResetPassword}
          >
            Forgot Password?
          </button>
        )}
        <button
          type="button"
          className="switch-auth"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  );
};
