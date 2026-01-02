// components/.../SocialNetworkBox.jsx
"use client";
import React from "react";

export default function SocialNetworkBox() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend later
  };

  return (
    <form onSubmit={onSubmit} className="default-form">
      <div className="row">
        <div className="form-group col-lg-6 col-md-12">
          <label>Facebook</label>
          <input type="url" placeholder="www.facebook.com/Invision" name="facebook" />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Twitter</label>
          <input type="url" name="twitter" />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>LinkedIn</label>
          <input type="url" name="linkedin" />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Instagram</label>
          <input type="url" name="instagram" />
        </div>
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button className="theme-btn btn-style-one" type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}
