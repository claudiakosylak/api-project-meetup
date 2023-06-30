import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonDisable, setButtonDisable] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true)
    }
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUserLogin = () => {
    setErrors({});
    return dispatch(sessionActions.login({
      credential: "Demo-lition",
      password: "password"
    })).then(closeModal)
  }

  return (
    <>
    <div className="login-modal-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
      {errors.credential && (
          <p className="modal-errors">The provided credentials were invalid.</p>
        )}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className={buttonDisable ? "disabled-signup-button" : "signup-submit-button"} disabled={buttonDisable}>Log In</button>
      </form>
      <div className="demo-user-login-link" onClick={demoUserLogin}>
        Log in as Demo User
      </div>

    </div>
    </>
  );
}

export default LoginFormModal;
