import { Storage } from "./storage";

type Options = {
  key: string;
  exp: number;
};

export function withPersistentQuery<T extends () => Promise<any>>(
  queryFn: T,
  options: Options
) {
  const { key, exp } = options;

  return async (): Promise<Awaited<ReturnType<T>> | null> => {
    const cached = Storage.get<{ expAt: number; data: Awaited<ReturnType<T>> }>(
      key
    );

    if (!!cached?.data && cached.expAt > Date.now()) {
      return cached.data;
    }

    const result = await queryFn();
    if (!result) return null;

    Storage.set<{ expAt: number; data: Awaited<ReturnType<T>> }>(key, {
      expAt: Date.now() + exp,
      data: result,
    });

    return result || null;
  };
}
