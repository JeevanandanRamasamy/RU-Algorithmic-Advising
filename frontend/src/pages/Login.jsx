import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div className="login-wrapper">
        <form>
          <h2>Login</h2>
          <p>
            Need an Account?{" "}
            <span>
              <Link to="/create">
                <a href="Create an Account">Create An Account</a>
              </Link>
            </span>
          </p>
          <div className="input-group">
            <label htmlFor="netid">NETID</label>
            <input type="text" name="netid" id="netid" required />

            <br></br>

            <label htmlFor="password">PASSWORD</label>
            <input type="password" name="password" id="password" required />

            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
