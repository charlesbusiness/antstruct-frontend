import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import http from '../services/authentication/httpService';

const useSubmitData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigate()


    const submitData = async ({ data, method = 'post', endpoint, successMessage, navigationPath, reload = false }) => {
        try {
            const alternatelMessage = successMessage ?? "Success"

            setIsLoading(true);
            setError('');

            const responses = await axios({
                method: method,
                url: `${http.setURL}${endpoint}`,
                data: { ...data },
                headers: http.setJwtHeaders().headers
            });

            const responseData = responses.data;
            const message = responseData.message;

            setIsLoading(false);
            setError('');
            if (method === 'post') {
                toast.success(message || alternatelMessage, { autoClose: 3000 });
            }
            if (navigationPath) {
                navigation(navigationPath ?? '');
            }
            else if (reload) {
                setTimeout(function () {
                    window.location.reload()
                }, 3000)
            }
            return responseData; // Return data for potential future use

        } catch (ex) {
            let errorMsg = 'There was an unexpected error. Please try again';

            if (ex.response && ex.response.status < 500 && ex.response.status > 399) {
                errorMsg = ex.response.data.message ?? errorMsg;
                if (Array.isArray(errorMsg)) {
                    errorMsg = errorMsg[0];
                    const splittedMsg = errorMsg.split(":");
                    if (splittedMsg.length > 1) {
                        errorMsg = splittedMsg[0].concat(splittedMsg[1]);
                    }
                }
            } else if (ex.name == 'AxiosError' && ex.code == 'ERR_NETWORK') {
                errorMsg = "Please check your network"
            }

            setError(errorMsg);
            toast.error(errorMsg, { autoClose: 3000 });
            setIsLoading(false);
            throw ex;
        }
    };

    return { isLoading, error, submitData };
};

export default useSubmitData;