import React, { useEffect, useState} from "react";
import useSubmitData from "./useSubmitData";
import { ApiRoutes } from "../utils/ApiRoutes";

const useBusinessProfile = () => {
    const { submitData } = useSubmitData();
    const [businessUserProfile, setBusinessUserProfile] = useState(null);
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

    useEffect(() => {
        getBusinessUserProfile();
    }, []);

    return { businessUserProfile, error };
};
export default useBusinessProfile;