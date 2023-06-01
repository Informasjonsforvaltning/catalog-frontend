import { useQuery } from "@tanstack/react-query";

export const useGetHistory = ({ conceptId }) => {
    return useQuery({
      queryKey: ['getHistory', conceptId],
      queryFn: async () => {
        const response = await fetch(`/api/history?${new URLSearchParams({
          conceptId
        })}`, {
          method: 'GET' 
        });
        return response.json();
      },
    });
};
