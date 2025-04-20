import React, { useEffect, useState } from "react";
import useSubmitData from "./useSubmitData";
import { ApiRoutes } from "../utils/ApiRoutes";

const useBusinessProfile = () => {
    const { submitData } = useSubmitData();
    const [businessUserProfile, setBusinessUserProfile] = useState(null);
    const [employees, setEmployeesCount] = useState(null);
    const [departments, setDepartment] = useState(null);
    const [resources, setResource] = useState(null);
    const [error, setError] = React.useState({});

    const getBusinessUserProfile = async () => {
        const response = await submitData({
            data: {},
            endpoint: ApiRoutes.business.businessProfile,
            method: 'get'
        });

        if (!response?.error) {
            setBusinessUserProfile(response?.data);
        } else {
            setError(response?.error);
        }
    };

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

    useEffect(() => {
        getBusinessUserProfile();
        getEmployees()
        getDepartments()
        getApiResource()
    }, []);

    return {
        businessUserProfile,
        employees,
        departments,
        resources,
        error
    };
};
export default useBusinessProfile;