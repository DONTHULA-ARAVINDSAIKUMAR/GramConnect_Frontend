import React, { useState } from 'react';

const Register = ({ onLogin, navigateTo }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if(!res.ok) throw new Error("Registration failed");
      return res.json();
    })
    .then(user => {
      onLogin(user);
    })
    .catch(err => {
      // Mock registration
      onLogin({ id: Date.now(), ...formData });
    });
  };

  return (
    <div className="main-container" style={{maxWidth: '500px'}}>
      <div className="clean-card">
        <h2 style={{color: '#004d99', textAlign: 'center'}}>Citizen Registration</h2>
        <p style={{textAlign: 'center', color: '#555', marginBottom: '1.5rem'}}>Create an account to track your applications securely.</p>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <input type="text" placeholder="Full Name (as per Aadhaar)" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}} />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}} />
          <input type="tel" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}} />
          <input type="password" placeholder="Create Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'}} />
          <button type="submit" className="btn-primary" style={{marginTop: '10px', fontSize: '1.1rem'}}>Register Account</button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem'}}>
          Already registered? <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('login');}} style={{fontWeight: 'bold'}}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
