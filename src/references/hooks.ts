import { useFetchAccount } from "@account/queries";
import { AdministratorRoleName } from "@administration/types";
import { apiClient } from "@app/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { difference, filter, find, some, union } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Response } from "superagent";
import * as Yup from "yup";
import { useFetchReference } from "./queries";

export function getValidationSchema(sourceTypes: string[]) {
    return Yup.object({
        sourceType: Yup.string()
            .lowercase()
            .notOneOf(sourceTypes, "Source type already exists")
            .test(
                "containsNoSpaces",
                "Source types may not contain spaces",
                (value) => !value.includes(" "),
            )
            .trim(),
    });
}

export function useSourceTypesForm(sourceTypes: string[]) {
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm({
        defaultValues: { sourceType: "" },
        resolver: yupResolver(getValidationSchema(sourceTypes)),
    });

    return { errors, handleSubmit, register, reset };
}

export function useUpdateSourceTypes(
    key: "default_source_types" | "source_types",
    path: string,
    queryKey: readonly string[],
    sourceTypes: string[],
) {
    const queryClient = useQueryClient();

    const [lastRemoved, setLastRemoved] = useState("");

    const mutation = useMutation({
        mutationFn: async (sourceTypes: string[]): Promise<Response> => {
            return apiClient.patch(path).send({ [key]: sourceTypes });
        },
        onSuccess: (data: Response) => {
            const updatedSourceTypes = data.body[key];

            if (sourceTypes.length > updatedSourceTypes) {
                setLastRemoved(difference(sourceTypes, updatedSourceTypes)[0]);
            } else {
                setLastRemoved("");
            }

            queryClient.invalidateQueries({ queryKey });
        },
    });

    const { errors, handleSubmit, register, reset } =
        useSourceTypesForm(sourceTypes);

    function handleAdd({ sourceType }) {
        if (sourceType) {
            mutation.mutate(union(sourceTypes, [sourceType]), {
                onSuccess: () => {
                    reset();
                    setLastRemoved("");
                },
            });
        }
    }

    function handleRemove(sourceType) {
        mutation.mutate(
            sourceTypes.filter((s) => s !== sourceType),
            {
                onSuccess: () => {
                    setLastRemoved(sourceType);
                },
            },
        );
    }

    function handleUndo() {
        if (lastRemoved) {
            mutation.mutate(union(sourceTypes, [lastRemoved]), {
                onSuccess: () => {
                    setLastRemoved("");
                },
            });
        }
    }

    return {
        error: errors.sourceType?.message,
        lastRemoved,
        mutation,
        handleRemove,
        handleSubmit: handleSubmit(handleAdd),
        handleUndo,
        register,
    };
}

/**
 * All reference rights
 */
export enum ReferenceRight {
    build = "build",
    modify = "modify",
    modify_otu = "modify_otu",
    remove = "remove",
}

/**
 * Check if the logged in account has the passed `right` on the reference detail is loaded for.
 *
 * @param referenceId - The id of the reference to check
 * @param right - The right to check for (eg. modify_otu)
 * @returns Whether the right is possessed by the account
 */
export function useCheckReferenceRight(
    referenceId: string,
    right: ReferenceRight,
) {
    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const { data: reference, isPending: isPendingReference } =
        useFetchReference(referenceId);

    if (isPendingAccount || isPendingReference) {
        return { hasPermission: false, isPending: true };
    }

    if (account.administrator_role === AdministratorRoleName.FULL) {
        return { hasPermission: true, isPending: false };
    }

    const user = find(reference.users, { id: account.id });

    if (user?.[right]) {
        return { hasPermission: true, isPending: false };
    }

    // Groups in common between the user and the reference member groups.
    const groups = filter(reference.groups, (referenceGroup) =>
        some(
            account.groups,
            (accountGroup) => accountGroup.id === referenceGroup.id,
        ),
    );

    return {
        hasPermission: groups && some(groups, { [right]: true }),
        isPending: false,
    };
}
