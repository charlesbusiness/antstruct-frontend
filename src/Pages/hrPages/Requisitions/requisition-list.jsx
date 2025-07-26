
import { useState } from "react";
import { RequisitionTabs } from "./requisition-tab";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { useQuery } from "@tanstack/react-query";
import useSubmitData from "@src/hooks/useSubmitData";


export const RequisitionList = () => {
    const { submitData, isLoading } = useSubmitData()
    // const [requisitions, setRequisitions] = useState(dummyRequisitions);
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({
        type: "",
        status: "",
        approval_officer: "",
    })
    const requisitions = useQuery({
        queryKey: ['requisitions'],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.requisitions.requisitions,
                method: 'get',
            });
            if (response?.error) throw new Error('Failed to fetch API resources');
            return response.data;
        },
        keepPreviousData: true,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,         // don't refetch when window regains focus
        refetchOnReconnect: false,           // don't refetch on network reconnect
        refetchInterval: false,              // disable polling
    });

    const handleStatusChange = (id, newStatus) => {
        setRequisitions((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };


    // const filteredRequisitions = requisitions?.filter((req) => {
    //     const { type, status, approval_officer } = filters;
    //     return (
    //         (!type || req.type === type) &&
    //         (!status || req.status === status) &&
    //         (!approval_officer || req.approval_officer.toLowerCase().includes(approval_officer.toLowerCase()))
    //     )
    // })

    return (
        <>

            <RequisitionTabs
                requisitions={requisitions?.data || []}
            />
        </>

    );
};
