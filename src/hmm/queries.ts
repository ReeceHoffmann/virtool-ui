import { ErrorResponse } from "@/types/api";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { fetchHmm, installHmm, listHmms } from "./api";
import { Hmm, HMMInstalled, HmmSearchResults } from "./types";

/**
 * Factory object for generating hmm query keys
 */
export const hmmQueryKeys = {
    all: () => ["hmm"] as const,
    lists: () => ["hmm", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) =>
        ["hmm", "list", ...filters] as const,
    details: () => ["hmm", "details"] as const,
    detail: (hmmId: string) => ["hmm", "details", hmmId] as const,
};

/**
 * Fetch a page of hmm search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A page of hmms search results
 */
export function useListHmms(page: number, per_page: number, term?: string) {
    return useQuery<HmmSearchResults>({
        queryKey: hmmQueryKeys.list([page, per_page, term]),
        queryFn: () => listHmms(page, per_page, term),
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetches a single HMM
 *
 * @param hmmId - The id of the hmm to fetch
 * @returns A single HMM
 */
export function useFetchHmm(hmmId: string) {
    return useQuery<Hmm, ErrorResponse>({
        queryKey: hmmQueryKeys.detail(hmmId),
        queryFn: () => fetchHmm(hmmId),
        retry: (failureCount, error) => {
            if (error.response?.status === 404) {
                return false;
            }
            return failureCount <= 3;
        },
    });
}

/**
 * Initializes a mutator for installing hmms
 *
 * @returns A mutator for installing hmms
 */
export function useInstallHmm() {
    const queryClient = useQueryClient();

    return useMutation<HMMInstalled, ErrorResponse>({
        mutationFn: installHmm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hmmQueryKeys.lists() });
        },
    });
}
