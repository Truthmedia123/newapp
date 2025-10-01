// Vendor Search Endpoint
// Provides advanced search capabilities for wedding vendors

export default (router, { services, exceptions }) => {
  const { ItemsService } = services;
  const { ServiceUnavailableException } = exceptions;

  router.get('/', async (req, res, next) => {
    try {
      // Extract query parameters
      const { 
        query, 
        category, 
        location, 
        priceRange, 
        rating,
        limit = 20,
        offset = 0,
        sort = 'sort'
      } = req.query;

      // Initialize the vendors service
      const vendorsService = new ItemsService('vendors', {
        accountability: req.accountability,
        schema: req.schema,
      });

      // Build filter object
      const filter = {};

      // Add search query filter
      if (query) {
        filter._or = [
          { name: { _contains: query } },
          { description: { _contains: query } },
          { services: { _contains: query } }
        ];
      }

      // Add category filter
      if (category) {
        filter.category = { _eq: category };
      }

      // Add location filter
      if (location) {
        filter.location = { _contains: location };
      }

      // Add price range filter
      if (priceRange) {
        filter.price_range = { _eq: priceRange };
      }

      // Add rating filter
      if (rating) {
        filter.rating = { _gte: rating };
      }

      // Add status filter to only show published vendors
      filter.status = { _eq: 'published' };

      // Fetch vendors with filters
      const vendors = await vendorsService.readByQuery({
        filter,
        limit: parseInt(limit),
        offset: parseInt(offset),
        sort: [sort],
        fields: [
          'id',
          'name',
          'slug',
          'description',
          'category.name',
          'category.slug',
          'location',
          'price_range',
          'rating',
          'review_count',
          'profile_image.id',
          'profile_image.title',
          'profile_image.filename_disk',
          'featured',
          'verified'
        ]
      });

      // Get total count for pagination
      const totalCount = await vendorsService.readByQuery({
        filter,
        aggregate: {
          count: '*'
        }
      });

      // Return results
      res.json({
        data: vendors,
        meta: {
          filter: {
            query,
            category,
            location,
            priceRange,
            rating
          },
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: totalCount[0].count
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Get vendor by slug
  router.get('/slug/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;

      const vendorsService = new ItemsService('vendors', {
        accountability: req.accountability,
        schema: req.schema,
      });

      // Fetch vendor by slug
      const vendor = await vendorsService.readByQuery({
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        fields: [
          '*',
          'category.name',
          'category.slug',
          'packages.*',
          'reviews.*',
          'reviews.customer_name',
          'gallery.*'
        ]
      });

      if (!vendor || vendor.length === 0) {
        return next(new exceptions.ForbiddenException());
      }

      res.json({
        data: vendor[0]
      });
    } catch (error) {
      next(error);
    }
  });

  // Get featured vendors
  router.get('/featured', async (req, res, next) => {
    try {
      const { limit = 6 } = req.query;

      const vendorsService = new ItemsService('vendors', {
        accountability: req.accountability,
        schema: req.schema,
      });

      // Fetch featured vendors
      const vendors = await vendorsService.readByQuery({
        filter: {
          featured: { _eq: true },
          status: { _eq: 'published' }
        },
        sort: ['-rating'],
        limit: parseInt(limit),
        fields: [
          'id',
          'name',
          'slug',
          'category.name',
          'location',
          'price_range',
          'rating',
          'review_count',
          'profile_image.id',
          'profile_image.filename_disk'
        ]
      });

      res.json({
        data: vendors
      });
    } catch (error) {
      next(error);
    }
  });

  // Get vendors by category
  router.get('/category/:categorySlug', async (req, res, next) => {
    try {
      const { categorySlug } = req.params;
      const { limit = 20, offset = 0 } = req.query;

      const vendorsService = new ItemsService('vendors', {
        accountability: req.accountability,
        schema: req.schema,
      });

      // Fetch vendors by category
      const vendors = await vendorsService.readByQuery({
        filter: {
          'category.slug': { _eq: categorySlug },
          status: { _eq: 'published' }
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        sort: ['sort'],
        fields: [
          'id',
          'name',
          'slug',
          'description',
          'location',
          'price_range',
          'rating',
          'review_count',
          'profile_image.id',
          'profile_image.filename_disk'
        ]
      });

      // Get total count for pagination
      const totalCount = await vendorsService.readByQuery({
        filter: {
          'category.slug': { _eq: categorySlug },
          status: { _eq: 'published' }
        },
        aggregate: {
          count: '*'
        }
      });

      res.json({
        data: vendors,
        meta: {
          category: categorySlug,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: totalCount[0].count
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });
};