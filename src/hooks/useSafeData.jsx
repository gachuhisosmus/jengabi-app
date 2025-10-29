// This is a React hook - MUST be .jsx
import { useState, useEffect } from 'react';
import { sanitizeBusinessQuery } from '../utils/dataSanitizer';

export const useSafeData = (userProfile) => {
  const [safeData, setSafeData] = useState(null);
  
  const prepareSafeQuery = (question) => {
    return sanitizeBusinessQuery(userProfile, question);
  };
  
  return { safeData, prepareSafeQuery };
};