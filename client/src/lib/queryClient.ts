import { QueryClient } from "@tanstack/react-query";
import type { QueryFunction } from "@tanstack/react-query";

console.log("queryClient module loaded");

async function throwIfResNotOk(res: Response) {
  console.log("Checking response status:", res.status, res.statusText);
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error("Response not OK:", res.status, text);
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log("Making API request:", method, url);
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    console.log("API request successful:", method, url);
    return res;
  } catch (error) {
    console.error("API request failed:", method, url, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }: { queryKey: string[] }) => {
    try {
      console.log("Fetching data for queryKey:", queryKey);
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      console.log(`API request to ${queryKey[0]} returned status:`, res.status);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Returning null for 401 response");
        return null as any;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`API request to ${queryKey[0]} returned data:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching from ${queryKey[0]}:`, error);
      // Re-throw the error so the UI can handle it properly
      throw error;
    }
  };

console.log("Creating QueryClient instance");
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed to "returnNull" to be more lenient
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
console.log("QueryClient instance created successfully");