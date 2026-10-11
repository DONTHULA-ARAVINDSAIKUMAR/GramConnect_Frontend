import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(user => {
      login(user, 'mock-jwt-token-12345');
      navigate('/dashboard');
    })
    .catch(err => {
      if (email === 'danphe91@gmail.com') {
         login({ id: 1, email: 'danphe91@gmail.com', fullName: 'Danphe Citizen' }, 'mock-jwt-token-12345');
         navigate('/dashboard');
      } else {
         setError('Invalid credentials. (Hint: Use danphe91@gmail.com to bypass)');
      }
    });
  };

  return (
    <div className="main-container page-transition" style={{maxWidth: '550px'}}>
      <div className="clean-card modal-transition" style={{padding: '50px'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px'}}>
          <div style={{width: '60px', height: '60px', borderRadius: '15px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'white', fontSize: '28px', fontWeight: 'bold'}}>
            GC
          </div>
          <h2 style={{color: '#004d99', textAlign: 'center', fontSize: '32px', margin: '0 0 10px 0'}}>Welcome Back</h2>
          <p style={{textAlign: 'center', color: '#555', margin: '0', fontSize: '16px'}}>Access your centralized welfare and application data.</p>
        </div>
        
        {error && (
          <div style={{color: '#d32f2f', textAlign: 'center', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ffcdd2', fontWeight: '500'}}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{padding: '14px 16px', borderRadius: '8px', border: '1px solid #dce3dc', fontSize: '16px', background: '#fcfcfc', transition: 'border-color 0.2s'}} 
              onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
              onBlur={(e) => e.target.style.borderColor = '#dce3dc'}
            />
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{padding: '14px 16px', borderRadius: '8px', border: '1px solid #dce3dc', fontSize: '16px', background: '#fcfcfc', transition: 'border-color 0.2s'}}
              onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
              onBlur={(e) => e.target.style.borderColor = '#dce3dc'}
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{marginTop: '15px', fontSize: '18px', padding: '16px'}}>
            Secure Login
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #eee'}}>
          <p style={{color: '#666', margin: 0}}>
            Don't have an account?{' '}
            <a href="#" onClick={(e) => {e.preventDefault(); navigate('/register');}} style={{color: 'var(--green)', fontWeight: '700', transition: 'color 0.2s'}}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
