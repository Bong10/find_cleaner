"use client";
import { useState } from "react";

const FormContent2 = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form method="post" action="add-parcel.html">
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="username" placeholder="Username" required />
      </div>
      {/* name */}

      <div className="form-group">
        <label>Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="password-field"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            style={{ paddingRight: '45px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#696969',
              fontSize: '18px'
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={showPassword ? "la la-eye-slash" : "la la-eye"}></i>
          </button>
        </div>
      </div>
      {/* password */}

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit">
          Register
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContent2;
