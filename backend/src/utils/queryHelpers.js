// Query helper utilities for pagination, sorting, filtering

export const buildQuery = (queryParams, Model) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    fields,
    ...filters
  } = queryParams;

  // Build base query
  let query = Model.find();

  // Apply filters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined) {
      query = query.where(key).equals(filters[key]);
    }
  });

  // Apply search (text index)
  if (search) {
    query = query.find({ $text: { $search: search } });
  }

  // Apply field selection
  if (fields) {
    const selectedFields = fields.split(',').join(' ');
    query = query.select(selectedFields);
  }

  // Apply sorting
  query = query.sort(sort);

  return {
    query,
    page: parseInt(page),
    limit: parseInt(limit)
  };
};

export const paginate = async (query, page, limit) => {
  const skip = (page - 1) * limit;
  
  const [docs, totalDocs] = await Promise.all([
    query.skip(skip).limit(limit),
    query.model.countDocuments(query.getQuery())
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    docs,
    pagination: {
      page,
      limit,
      totalPages,
      totalDocs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};