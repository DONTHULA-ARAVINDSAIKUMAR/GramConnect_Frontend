import React from 'react';

const JobCard = ({ job, onApply }) => {
  return (
    <div className="clean-card">
      <h3>{job.title}</h3>
      <p style={{ color: '#004d99', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95em' }}>
        {job.employer} &bull; {job.location}
      </p>
      <p>{job.description}</p>
      <div className="meta">
        <strong>Compensation:</strong> {job.wageOrSalary}
      </div>
      <a 
        href={`tel:${job.contactInfo}`} 
        className="btn-primary" 
        style={{textAlign: 'center'}}
        onClick={() => onApply("JOB", `${job.title} - ${job.employer}`)}
      >
        Call to Apply
      </a>
    </div>
  );
};

export default JobCard;
