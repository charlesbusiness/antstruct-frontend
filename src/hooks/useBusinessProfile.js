import { useQuery } from '@tanstack/react-query';
import useSubmitData from './useSubmitData';
import { ApiRoutes } from '../utils/ApiRoutes';
import { useState, useMemo } from 'react';

const useBusinessProfile = () => {
    const { submitData } = useSubmitData();
    const [expandedModules, setExpandedModules] = useState({});

    const businessProfileQuery = useQuery({
        queryKey: ['businessProfile'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.businessProfile,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch business profile');
            return response.data;
        },
    });



    const appModules = useQuery({
        queryKey: ['businessProfile'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.apiResources.appModules,
                method: 'get'
            });
            if (response?.error) throw new Error('Failed to fetch business profile');
            return response.data;
        },
        keepPreviousData: true,
    });

    const employeesQuery = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.employees.getEmployees,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch employees');
            return response.data;
        },
        enabled: !!businessProfileQuery.data, // runs only after profile is loaded
    });

    const departmentsQuery = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.getDepartments,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch departments');
            return response.data;
        },
        enabled: !!businessProfileQuery.data,
    });



    const resourcesQuery = useQuery({
        queryKey: ['resources'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.apiResources.publicApis,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        enabled: !!businessProfileQuery.data,
    });


    const roles = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.roles,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        enabled: !!businessProfileQuery.data,
    });

    // === Computed values ===

    const groupedResources = useMemo(() => {
        if (!businessProfileQuery.data) return null;

        const filtered = businessProfileQuery.data?.resources?.filter(r => r.isActionBase) || [];

        return filtered.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {});
    }, [businessProfileQuery.data]);

    // === UI State ===

    const toggleModule = (moduleName) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    return {
        businessUserProfile: groupedResources,
        businessInfo: businessProfileQuery.data,
        employees: employeesQuery.data,
        roles: roles.data,
        departments: departmentsQuery.data,
        resources: resourcesQuery.data,
        modules: appModules.data,
        error: businessProfileQuery.error || employeesQuery.error || departmentsQuery.error || resourcesQuery.error || roles.error || appModules.error,
        expandedModules,
        toggleModule,
        isLoading: businessProfileQuery.isLoading || employeesQuery.isLoading || departmentsQuery.isLoading || resourcesQuery.isLoading || roles.isLoading || appModules.isLoading,
    };
};

export default useBusinessProfile;
