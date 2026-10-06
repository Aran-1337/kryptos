/**
 * Build pagination metadata and query options
 */
const paginate = (query = {}) => {
  const rawPage = parseInt(query?.page, 10);
  const page = (!isNaN(rawPage) && rawPage >= 1) ? rawPage : 1;
  const rawLimit = parseInt(query?.limit, 10);
  const validLimit = (!isNaN(rawLimit) && rawLimit >= 1) ? rawLimit : 10;
  const limit = Math.min(100, Math.max(1, validLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const paginateResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});

module.exports = { paginate, paginateResponse };
