import { QueryClient } from "@tanstack/react-query";
import { getVendors, getFeaturedVendors, getCategories, getRecentBlogPosts } from "./directus";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { Vendor, BlogPost } from "@shared/schema";

console.log("queryClient module loaded");

export async function throwIfResNotOk(res: Response) {
  console.log("Checking response status:", res.status, res.statusText);
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error("Response not OK:", res.status, text);
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

// Updated query function to use Directus SDK
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: QueryFunctionContext) => Promise<T> =
  <T>(options: { on401: UnauthorizedBehavior }) =>
  async ({ queryKey }: QueryFunctionContext) => {
    try {
      console.log("Fetching data for queryKey:", queryKey);
      
      // Map query keys to Directus API calls
      switch (queryKey[0]) {
        case "/api/vendors/featured":
          const featuredVendors = await getFeaturedVendors(6);
          console.log("Directus featured vendors:", featuredVendors);
          return featuredVendors as unknown as T;
          
        case "/api/blog":
          const blogPosts = await getRecentBlogPosts(5);
          console.log("Directus blog posts:", blogPosts);
          return blogPosts as unknown as T;
          
        default:
          // For other endpoints, we'll need to implement specific handlers
          // For now, we'll throw an error to identify unhandled cases
          throw new Error(`Unhandled query key: ${queryKey[0]}`);
      }
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