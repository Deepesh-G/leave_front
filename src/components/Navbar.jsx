import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:10,height:10,background:'#16a34a',borderRadius:10}}></div>
        <strong>Leave Management</strong>
      </div>
      <div>
        {user ? (
          <>
            <span style={{marginRight:12}}>Hi, {user.name}</span>
            <button onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : <Link to="/">Login</Link>}
      </div>
    </div>
  );
}