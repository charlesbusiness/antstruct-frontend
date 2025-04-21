import React, { useEffect, useState } from "react";
import useSubmitData from "./useSubmitData";
import { ApiRoutes } from "../utils/ApiRoutes";

const useBusinessProfile = () => {
    const { submitData } = useSubmitData();
    const [businessUserProfile, setBusinessUserProfile] = useState(null);
    const [employees, setEmployeesCount] = useState(null);
    const [departments, setDepartment] = useState(null);
    const [resources, setResource] = useState(null)
    const [error, setError] = React.useState({})
    const [expandedModules, setExpandedModules] = useState({});

    const getEmployees = async () => {
        const response = await submitData({
            data: {},
            endpoint: ApiRoutes.employees.getEmployees,
            method: 'get'
        })

        if (!response?.error) {
            setEmployeesCount(response?.data)
            console.log(employees?.length)
        }
    }

    const getDepartments = async () => {
        const response = await submitData({
            data: {},
            endpoint: ApiRoutes.business.getDepartments,
            method: 'get'
        })
        if (response?.error == false) {
            setDepartment(response?.data)
        }
    }

    const getApiResource = async () => {
        const response = await submitData({
            data: {},
            endpoint: `${ApiRoutes.business.apiResources.publicApis}`,
            method: 'get'
        })
        if (response?.error == false) {
            setResource(response?.data)
        }
    }


    const toggleModule = (moduleName) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    const getProfile = async () => {
        const response = await submitData({
            data: {},
            endpoint: ApiRoutes.business.businessProfile,
            method: 'get',
        });

        if (!response?.error) {
            const { data } = response

            const filteredData = data?.resources?.filter((r) => r.isActionBase) || [];

            const groupedRoutes = filteredData.reduce((acc, curr) => {
                if (!acc[curr.module]) acc[curr.module] = [];
                acc[curr.module].push(curr);
                return acc;
            }, {});

            setBusinessUserProfile(groupedRoutes);
        }
    };

    useEffect(() => {
        getProfile()
    }, []);

    useEffect(() => {
        if (businessUserProfile) {

            getEmployees()
            getDepartments()
            getApiResource()
        }
    }, [businessUserProfile]);

    return {
        businessUserProfile,
        employees,
        departments,
        resources,
        error,
        expandedModules,
        toggleModule
    };
};
export default useBusinessProfile;