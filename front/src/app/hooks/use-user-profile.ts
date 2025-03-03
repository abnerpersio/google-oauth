import { storageKeys } from "@/app/constants/storage-keys";
import { Storage } from "@/app/lib/utils/storage";
import { withPersistentQuery } from "@/app/lib/utils/with-persistent-query";
import { UserService } from "@/app/services/user-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const EXPIRATION_IN_MS = 24 * 60 * 60 * 1000;

type Options = {
  enabled?: boolean;
};

export function useUserProfile(options?: Options) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user", "profile"],
    queryFn: withPersistentQuery(new UserService().getProfile, {
      key: storageKeys.userDetails,
      exp: EXPIRATION_IN_MS,
    }),
    enabled: options?.enabled,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const remove = useCallback(() => {
    queryClient.removeQueries({
      queryKey: ["user", "profile"],
    });
  }, [queryClient]);

  const resetCache = useCallback(() => {
    Storage.delete(storageKeys.userDetails);
    queryClient.invalidateQueries({
      queryKey: ["user", "profile"],
    });
  }, [queryClient]);

  return { ...query, remove, resetCache };
}
