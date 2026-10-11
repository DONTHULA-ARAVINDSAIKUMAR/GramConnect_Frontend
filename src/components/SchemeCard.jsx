import React from 'react';

const SchemeCard = ({ scheme, onApply }) => {
  return (
    <div className="clean-card">
      <h3>{scheme.name}</h3>
      <p>{scheme.description}</p>
      <div className="meta">
        <strong>Eligibility:</strong> {scheme.eligibilityCriteria}
      </div>
      <a 
        href={scheme.applicationLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary"
        onClick={() => onApply("SCHEME", scheme.name)}
      >
        Proceed to Official Portal ↗
      </a>
    </div>
  );
};

export default SchemeCard;
