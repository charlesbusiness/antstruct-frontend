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
        keepPreviousData: true,
    });

    const apiResources = useQuery({
        queryKey: ['apiResources'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.admin.apiResources.get(true),
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch  Api endpoints');
            return response.data;
        },
        keepPreviousData: true,
    });
    // Once the businessProfileQuery has data, build allowed & endpoints:
    const { allowed, endpoints } = useMemo(() => {
        const resources = apiResources?.data || [];

        const allowedSet = new Set();
        const endpointsMap = {};

        resources?.forEach(r => {
            allowedSet.add(r.endpoint);

            // e.g. 'createProject' → 'CREATE_PROJECT'
            const key = r.endpoint
                .replace(/([A-Z])/g, '_$1')  // camelCase → _camel_Case
                .toUpperCase()               // → _CAMEL_CASE
                .replace(/^_/, '');          // → CAMEL_CASE

            endpointsMap[key] = r.endpoint;
        });

        return { allowed: allowedSet, endpoints: endpointsMap };
    }, [apiResources.data]);

    // console.log(endpoints)
    const appModules = useQuery({
        queryKey: ['appModules'],
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
        keepPreviousData: true,
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
        keepPreviousData: true,
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
        keepPreviousData: true,
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
        keepPreviousData: true,
        enabled: !!businessProfileQuery.data,
    })

    const platformRoles = useQuery({
        queryKey: ['platformRoles'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.platformRoles,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    })


    const businessCategories = useQuery({
        queryKey: ['businessCategories'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.getCategory,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    });

    const businessSizes = useQuery({
        queryKey: ['businessSizes'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.business.size,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    });

    const projects = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.projects.projects,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    });

    const leaveCategory = useQuery({
        queryKey: ['leaveCategory'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.hrManager.leave.category.get,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    });

    const employmentGrade = useQuery({
        queryKey: ['employmentGrade'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.hrManager.grades.get,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
    });


    const groupedResources = useMemo(() => {
        if (!businessProfileQuery.data) return null;

        const filtered = businessProfileQuery.data?.resources?.filter(r => r.isActionBase) || [];

        return filtered.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {});
    }, [businessProfileQuery.data]);


    const toggleModule = (moduleName) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    return {
        businessUserProfile: groupedResources,
        businessInfo: businessProfileQuery.data,
        allowed,
        endpoints,
        employmentGrade: employmentGrade.data,
        leaveCategory: leaveCategory.data,
        employees: employeesQuery.data,
        businessCategories: businessCategories.data,
        businessSizes: businessSizes.data,
        roles: roles.data,
        departments: departmentsQuery.data,
        resources: resourcesQuery.data,
        platformRoles: platformRoles.data,
        modules: appModules.data,
        error: businessProfileQuery.error || employeesQuery.error || departmentsQuery.error || resourcesQuery.error || roles.error || appModules.error || businessCategories.error || businessSizes.error || projects.error || platformRoles.error,
        expandedModules,
        toggleModule,
        projects: projects.data,
        isLoading: businessProfileQuery.isLoading || employeesQuery.isLoading || departmentsQuery.isLoading || resourcesQuery.isLoading || roles.isLoading || appModules.isLoading || businessCategories.isLoading || businessSizes.isLoading || projects.isLoading || platformRoles.isLoading,
    };
};

export default useBusinessProfile;
