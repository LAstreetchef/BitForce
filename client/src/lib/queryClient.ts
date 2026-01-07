import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

function buildUrlFromQueryKey(queryKey: readonly unknown[]): string {
  const parts: string[] = [];
  let params: Record<string, string> = {};
  
  for (const part of queryKey) {
    if (typeof part === "string") {
      parts.push(part);
    } else if (typeof part === "object" && part !== null) {
      params = { ...params, ...(part as Record<string, string>) };
    }
  }
  
  let url = parts.join("/");
  
  const paramEntries = Object.entries(params);
  if (paramEntries.length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of paramEntries) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    url += `?${searchParams.toString()}`;
  }
  
  return url;
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = buildUrlFromQueryKey(queryKey);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
