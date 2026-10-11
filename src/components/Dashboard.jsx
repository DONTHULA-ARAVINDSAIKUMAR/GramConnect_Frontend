import React, { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/applications/user/${user.id}`)
      .then(res => {
        if(!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => {
        // Mock historical data if backend is offline
        setHistory([
          { id: 1, type: "SCHEME", title: "PM Kisan Samman Nidhi", appliedAt: new Date().toISOString() },
          { id: 2, type: "JOB", title: "Farm Supervisor - Kisan Co-op", appliedAt: new Date(Date.now() - 86400000).toISOString() }
        ]);
      });
  }, [user.id]);

  return (
    <div className="main-container">
      <h2 className="section-header">Dashboard - Welcome, {user.fullName}</h2>
      
      <div className="clean-card" style={{marginBottom: '2rem', borderLeft: '4px solid #28a745'}}>
        <h3 style={{marginBottom: '5px'}}>Profile Verification Status: <span style={{color: '#28a745'}}>Verified &nbsp;✓</span></h3>
        <p style={{margin: '0'}}><strong>Registered Email:</strong> {user.email}</p>
        <p style={{margin: '5px 0 0 0'}}>All notifications and updates will be sent to your email.</p>
      </div>
      
      <h3 style={{color: '#004d99', marginBottom: '1rem'}}>Your Application & Access History</h3>
      {history.length === 0 ? (
        <p>You have not applied for any schemes or jobs yet.</p>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden'}}>
            <thead>
              <tr style={{backgroundColor: '#004d99', color: 'white'}}>
                <th style={{padding: '15px', textAlign: 'left'}}>Category</th>
                <th style={{padding: '15px', textAlign: 'left'}}>Service Name</th>
                <th style={{padding: '15px', textAlign: 'left'}}>Date Accessed</th>
                <th style={{padding: '15px', textAlign: 'left'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '15px'}}><strong>{item.type}</strong></td>
                  <td style={{padding: '15px'}}>{item.title}</td>
                  <td style={{padding: '15px'}}>{new Date(item.appliedAt).toLocaleDateString()}</td>
                  <td style={{padding: '15px', color: '#e67e22', fontWeight: 'bold'}}>In Progress</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
