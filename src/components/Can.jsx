// src/components/Can.jsx
import React from 'react';
import { useCanAccess } from '../hooks/useCanAccess';

export default function Can({ endpoint, children }) {
    return useCanAccess(endpoint) ? <>{children}</> : null;
}
