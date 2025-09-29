import { InstantSearch, SearchBox, Hits, RefinementList } from 'react-instantsearch-hooks-web';
import type { Hit } from 'instantsearch.js';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

// Initialize search client with MeiliSearch (using Algolia-compatible API)
const searchClient = instantMeiliSearch(
  process.env.MEILI_HOST || 'http://localhost:7700',
  process.env.MEILI_KEY || 'masterKey'
);

interface VendorHit extends Hit {
  id: number;
  name: string;
  category: string;
  location: string;
  address: string;
  description: string;
}

export function AlgoliaSearch() {
  const HitComponent = ({ hit }: { hit: VendorHit }) => (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/vendor/${hit.id}`}>
      <div className="font-semibold text-gray-900">{hit.name}</div>
      <div className="text-sm text-gray-500">{hit.category} • {hit.location}</div>
      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{hit.description}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <InstantSearch searchClient={searchClient} indexName="vendors">
        <div className="mb-6">
          <SearchBox 
            placeholder="Search vendors..." 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Filter by Category</h3>
            <RefinementList attribute="category" />
          </div>
          
          <div className="md:col-span-3">
            <Hits hitComponent={HitComponent} />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}