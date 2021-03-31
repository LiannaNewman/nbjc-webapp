import wrappedFetch from './wrappedFetch';
import { getToken, getUserID } from './auth';

/**
 * Fetch a space by id.
 * @param {string} spaceId - id for the space to return
 * @returns {Promise} - resolves to a single space
*/
const getSpace = async (spaceId) => {
  const url = new URL(process.env.REACT_APP_API_HOST);
  url.pathname = `/api/v1/spaces/${spaceId}`;
  const result = await wrappedFetch(url.href);
  return result;
};

/**
 *  * Fetch 5 spaces for autocomplete
 * @param {Object} spaceOpts
 * @param {string} spaceOpts.name - name to fetch
*/
const getSpacesByName = async (spaceOpts) => {
  const url = new URL(process.env.REACT_APP_API_HOST);
  url.pathname = '/api/v1/spaces';
  url.searchParams.append('search', spaceOpts.name);
  url.searchParams.append('page', 1);
  url.searchParams.append('per_page', 5);
  url.searchParams.append('fields', 'id,name');
  const results = await wrappedFetch(url.href);
  let formattedSpaces = [];
  try {
    const { data } = await results;
    formattedSpaces = data.map((space) => ({
      name: space.name,
      value: `${space.id}`,
    }));
  } catch (e) {
    // since this is autocomplete
    // allow users to search by raw text
    formattedSpaces = [];
  }
  return new Promise((resolve) => {
    resolve(formattedSpaces);
  });
};

const postSpace = async () => {
  const url = new URL(process.env.REACT_APP_API_HOST);
  const token = await getToken();
  url.pathname = '/api/v1/spaces';
  const userID = getUserID();
  const data = {
    user_id: userID,
  };

  const results = await wrappedFetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    redirect: 'follow',
    body: JSON.stringify(data),
  });
  return results;
};

/**
 * Post a new Yelp API search for a space by a user
 * @param {Object} spaceOpts
 * @param {string} spaceOpts.name -name of space
 * @param {string} spaceOpts.city - space city
 * @param {string} spaceOpts.state - space state
 * @param {string} spaceOpts.zipcode - space zipcode
 * @param {Object} spaceOpts.user
 * @returns {Promise}
 */
const postYelpSearch = async (spaceOpts) => {
  const url = new URL(process.env.REACT_APP_API_HOST);
  url.pathname = '/api/v1/create_space_search';
  const data = {
    location: `${spaceOpts.city}, ${spaceOpts.state}`,
    zipcode: spaceOpts.zipcode,
    term: spaceOpts.name,
    user_id: spaceOpts.user.userId,
    auth0_id: spaceOpts.user.auth0Id,
  };
  const spaceSearch = {
    space_search: data,
  };
  const results = await wrappedFetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spaceOpts.user.token}`,
    },
    redirect: 'follow',
    body: JSON.stringify(spaceSearch),
  });
  return results;
};

/**
 * Post a new Yelp API search for a space by a user
 * @param {Object} spaceOpts
 * @param {Array} spaceOpts.chips
 * @param {Boolean} spaceOpts.anonymous
 * @param {Number} spaceOpts.rating
 * @param {string} spaceOpts.content
 * @param {Object} spaceOpts.user
 * @param {Object} spaceOpts.business
 * @returns {Promise}
 */
const postAddSpace = async (spaceOpts) => {
  const url = new URL(process.env.REACT_APP_API_HOST);
  url.pathname = '/api/v1/spaces';

  // const indicators = Object.assign({}, ...spaceOpts.chips.map((element) => {
  //   const indicatorFormat = { name: '' };
  //   indicatorFormat.name = element.name;
  //   return indicatorFormat;
  // }));

  const data = {
    phone: spaceOpts.business.phone,
    name: spaceOpts.business.name,
    price_level: spaceOpts.business.price_level,
    provider_urn: spaceOpts.business.provider_urn,
    provider_url: spaceOpts.business.provider_url,
    latitude: spaceOpts.business.coordinates.latitude,
    longitude: spaceOpts.business.coordinates.longitude,
    address_attributes: {
      address_1: spaceOpts.business.location.address1,
      address_2: `${spaceOpts.business.location.address2 !== null
        ? spaceOpts.business.location.address2 : ''} ${spaceOpts.business.location.address3 !== null
        ? spaceOpts.business.location.address3 : ''}`,
      city: spaceOpts.business.location.city,
      postal_code: spaceOpts.business.location.zipcode,
      country: spaceOpts.business.location.country,
      state: spaceOpts.business.location.state,
    },
    // indicators_attributes: indicators,
    reviews_attributes: {
      anonymous: spaceOpts.anon,
      rating: spaceOpts.rating,
      content: spaceOpts.review,
      user_id: spaceOpts.user.userId,
    },
  };
  const addSpace = {
    space: data,
  };
  const results = await wrappedFetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spaceOpts.user.token}`,
    },
    redirect: 'follow',
    body: JSON.stringify(addSpace),
  });
  return results;
};

export {
  getSpace, postYelpSearch, postAddSpace, postSpace, getSpacesByName,
};
