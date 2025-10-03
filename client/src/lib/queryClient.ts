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

// Function to fetch data from static JSON files
async function fetchStaticData<T>(path: string): Promise<T> {
  try {
    console.log("Attempting to fetch static data from:", path);
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch static data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Successfully fetched static data from:", path);
    return data;
  } catch (error) {
    console.error("Error fetching static data from", path, ":", error);
    throw error;
  }
}

// Updated query function to use Directus SDK with static fallback
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
          try {
            // Try Directus API first
            const featuredVendors = await getFeaturedVendors(6);
            console.log("Directus featured vendors:", featuredVendors);
            return featuredVendors as unknown as T;
          } catch (directusError) {
            console.warn("Directus API failed, falling back to static data:", directusError);
            // Fallback to static JSON
            try {
              const staticVendors = await fetchStaticData<Vendor[]>('/data/vendors.json');
              console.log("Static featured vendors:", staticVendors);
              return staticVendors.slice(0, 6) as unknown as T;
            } catch (staticError) {
              console.error("Both Directus and static fallback failed:", staticError);
              throw staticError;
            }
          }
          
        case "/api/blog":
          try {
            // Try Directus API first
            const blogPosts = await getRecentBlogPosts(5);
            console.log("Directus blog posts:", blogPosts);
            return blogPosts as unknown as T;
          } catch (directusError) {
            console.warn("Directus API failed, falling back to static data:", directusError);
            // Fallback to static JSON
            try {
              const staticBlogPosts = await fetchStaticData<BlogPost[]>('/data/blog.json');
              console.log("Static blog posts:", staticBlogPosts);
              return staticBlogPosts.slice(0, 5) as unknown as T;
            } catch (staticError) {
              console.error("Both Directus and static fallback failed:", staticError);
              throw staticError;
            }
          }
          
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