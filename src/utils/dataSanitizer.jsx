// This is a React utility file - keep .jsx
import React from 'react';

export const sanitizeBusinessQuery = (userData, question) => {
  // Remove PII from user data before sending to API
  return {
    safe_question: removePIIFromText(question),
    business_context: {
      industry: userData.business_type,
      size_tier: getBusinessSize(userData.employee_count),
      location_region: getRegionFromLocation(userData.location),
      product_categories: userData.business_products,
    }
  };
};

// Can use React components if needed for error handling
export const DataSanitizationError = ({ message }) => (
  <div className="error-message">{message}</div>
);