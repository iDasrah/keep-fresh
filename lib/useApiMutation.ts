import {useMutation, UseMutationResult} from "@tanstack/react-query";

type MutationFn<TArgs, TData> = (args: TArgs) => Promise<TData>;

export function useApiMutation<TArgs, TData>(
    apiFn: MutationFn<TArgs, TData>,
    options?: Omit<UseMutationResult<TData, unknown, TArgs>, 'mutationFn'>,
) {
    return useMutation<TData, unknown, TArgs>({
        mutationFn: apiFn,
        ...options,
    });
}