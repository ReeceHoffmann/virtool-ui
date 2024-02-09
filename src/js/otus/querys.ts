import { useInfiniteQuery, useMutation } from "react-query";
import { addIsolate, editIsolate, findOTUs } from "./api";
import { OTUIsolate, OTUSearchResult } from "./types";

/**
 * Factory for generating react-query keys for otu related queries.
 */
export const OTUQueryKeys = {
    all: () => ["OTU"] as const,
    lists: () => ["OTU", "list"] as const,
    list: (filters: string[]) => ["OTU", "list", ...filters] as const,
    infiniteLists: () => ["OTU", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["OTU", "list", "infinite", ...filters] as const,
    details: () => ["OTU", "details"] as const,
    detail: (id: string) => ["OTU", "detail", id] as const,
};

/**
 * Gets a paginated list of OTUs.
 *
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @param verified - Filter the results to verified OTUs only
 * @returns The paginated list of indexes
 */
export function useInfiniteFindOTUS(refId: string, term: string, verified?: boolean) {
    return useInfiniteQuery<OTUSearchResult>(
        OTUQueryKeys.infiniteList([refId, term]),
        ({ pageParam }) => findOTUs({ refId, term, verified, page: pageParam }),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
            keepPreviousData: true,
        },
    );
}

/**
 * Initializes a mutator for creating an OTU isolate
 *
 * @returns A mutator for creating an OTU isolate
 */
export function useCreateIsolate() {
    return useMutation<OTUIsolate, unknown, { otuId: string; sourceType: string; sourceName: string }>(
        ({ otuId, sourceType, sourceName }) => addIsolate(otuId, sourceType, sourceName),
    );
}

/**
 * Initializes a mutator for editing an OTU isolate
 *
 * @returns A mutator for editing an OTU isolate
 */
export function useUpdateIsolate() {
    return useMutation<
        OTUIsolate,
        unknown,
        { otuId: string; isolateId: string; sourceType: string; sourceName: string }
    >(({ otuId, isolateId, sourceType, sourceName }) => editIsolate(otuId, isolateId, sourceType, sourceName));
}
