// src/hooks/useCanAccess.js
import { useMemo } from 'react';
import useBusinessProfile from './useBusinessProfile';

export function useCanAccess(endpoint) {
    const { businessInfo } = useBusinessProfile();
    const allowedSet = useMemo(() => {
        if (!businessInfo || !businessInfo?.resources) return new Set()
        return new Set(businessInfo?.resources.map(r => r.endpoint))
    }, [businessInfo])

    return allowedSet.has(endpoint);
}

