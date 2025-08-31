import { useQuery } from "@tanstack/react-query";
import useSubmitData from "./useSubmitData";
import { ApiRoutes } from "../utils/ApiRoutes";
export default function useGetStockMovement() {
    const { submitData } = useSubmitData();

    return useQuery({
        queryKey: ["inventoryData"],
        queryFn: async () => {
            const response = await submitData({
                data: {},
                endpoint: ApiRoutes.inventory.get,
                method: "get",
            });

            if (!response || response?.error) {
                throw new Error("Failed to fetch inventories");
            }

            return response?.data ?? [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60, // 1 min cache
    });
}
