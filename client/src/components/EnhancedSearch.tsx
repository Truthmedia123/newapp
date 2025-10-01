import React, { useState, useEffect, useRef } from 'react';
import { MeiliSearch } from 'meilisearch';
import { searchVendors, getCategories } from '../lib/directus';
import type { Vendor, Category } from '../lib/directus';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  location: string;
  rating: number;
  featured_image: any;
}

const EnhancedSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vendor[]>([]);
  const [meilisearchResults, setMeilisearchResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Meilisearch client
  const meilisearchClient = new MeiliSearch({
    host: process.env.REACT_APP_MEILISEARCH_HOST || 'http://localhost:7700',
    apiKey: process.env.REACT_APP_MEILISEARCH_KEY || 'masterKey',
  });

  const index = meilisearchClient.index('vendors');

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error: any) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 2 || selectedCategory || locationFilter) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setResults([]);
      setMeilisearchResults([]);
      setShowResults(false);
      setError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, selectedCategory, locationFilter]);

  // Perform search using both Directus and Meilisearch
  const performSearch = async () => {
    setIsLoading(true);
    setError(null);
    setShowResults(true);

    try {
      // Search with Directus
      const directusFilters: any = {};
      if (selectedCategory) {
        directusFilters.category = selectedCategory;
      }
      if (locationFilter) {
        directusFilters.location = locationFilter;
      }

      const directusResults = await searchVendors(query, directusFilters);

      // Search with Meilisearch for autocomplete
      const searchQuery = query || '*';
      const meilisearchResponse = await index.search(searchQuery, {
        limit: 10,
        attributesToRetrieve: ['id', 'name', 'description', 'category', 'location', 'rating', 'featured_image'],
        filter: [
          selectedCategory ? `category.slug = '${selectedCategory}'` : '',
          locationFilter ? `location = '${locationFilter}'` : ''
        ].filter(Boolean).join(' AND ')
      });

      setResults(directusResults);
      setMeilisearchResults(meilisearchResponse.hits as SearchResult[]);
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message || 'An error occurred while searching');
      setResults([]);
      setMeilisearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSelectedCategory('');
    setLocationFilter('');
    setResults([]);
    setMeilisearchResults([]);
    setShowResults(false);
    setError(null);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.name);
    // Trigger a new search with the selected suggestion
    setTimeout(() => {
      performSearch();
    }, 100);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Find Wedding Vendors</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search for vendors (e.g., photographers, venues, caterers)..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 bg-gray-200 text-gray-700 border-t border-b border-r border-gray-300 rounded-r-lg hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="North Goa">North Goa</option>
              <option value="South Goa">South Goa</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
                  </h3>
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((vendor) => (
                      <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex">
                          {vendor.featured_image ? (
                            <img 
                              src={vendor.featured_image} 
                              alt={vendor.name} 
                              className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                          <div className="flex-grow">
                            <h4 className="font-semibold text-lg">{vendor.name}</h4>
                            <p className="text-sm text-gray-600">
                              {vendor.category && typeof vendor.category === 'object' && (vendor.category as any).name 
                                ? (vendor.category as any).name 
                                : 'Category'}
                            </p>
                            <p className="text-sm text-gray-600">{vendor.location}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(vendor.rating || 0) ? 'fill-current' : 'fill-none'}`} 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1 text-sm text-gray-600">
                                {vendor.rating ? vendor.rating.toFixed(1) : 'No rating'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {vendor.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No vendors found matching your criteria.</p>
                    <button 
                      onClick={clearSearch}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Autocomplete Suggestions */}
        {query.length > 0 && meilisearchResults.length > 0 && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {meilisearchResults.slice(0, 5).map((result) => (
              <div 
                key={result.id} 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(result)}
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-gray-600">
                  {result.category?.name} • {result.location}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;