import React from 'react';
import './LoginForm.module.scss';

function LoginForm() {
  return (
    <div className="form">
      <form>
        <div className="input-container">
          <label>Username</label>
          <input type="text" name="username"></input>
        </div>
        <div className="input-container">
          <label>Password</label>
          <input type="password" name="password" required></input>
        </div>
        <div className="button-container">
          <input type="submit"></input>

        </div>
      </form>
    </div>
  )
}

export default LoginForm;