import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import useQuery from '../../../hooks/useQuery';
import { getSearchResults } from '../../../api';
import utils from '../../../utils';

const getSearchCriteria = (query) => ({
  searchTerm: query.get('searchTerm'),
  distance: parseInt(query.get('distance'), 10) || 0,
  rating: parseFloat(query.get('rating')) || 0,
  price: parseInt(query.get('distance'), 10) || 0,
  indicators: query.getAll('indicators'),
  pageNumber: parseInt(query.get('pageSize'), 10) || 1,
  pageSize: parseInt(query.get('pageSize'), 10) || 20,
});

const useSearch = () => {
  // todo: this must be fetched and cached by the front end.
  const chips = [{
    name: 'Black Friendly',
    value: '1',
  }, {
    name: 'Inclusive',
    value: '2',
  }, {
    name: 'Black Owned',
    value: '3',
  }, {
    name: 'Gender Neutral Restrooms',
    value: '4',
  }, {
    name: 'Accessible',
    value: '5',
  }, {
    name: 'Queer hangout space',
    value: '6',
  }, {
    name: 'Trans friendly',
    value: '7',
  }, {
    name: 'Queer owned',
    value: '8',
  }];
  const [searchResults, setSearchResults] = useState([]);
  const query = useQuery();
  const history = useHistory();
  const { promiseInProgress } = usePromiseTracker();

  const searchCriteria = getSearchCriteria(query);
  const [search, setSearch] = useState({
    ...searchCriteria,
    chips: chips.map((c) => ({
      ...c,
      isSelected: searchCriteria.indicators.includes(c.value),
    })),
  });

  useEffect(() => {
    async function fetchData() {
      if (searchCriteria.searchTerm === 'empty') {
        setSearchResults([]);
        return;
      }
      const { data } = await getSearchResults(searchCriteria);
      if (data.length === 0) {
        setSearchResults([]);
        return;
      }
      setSearchResults(data.slice(0, 9).map(utils.formatSearchResults));
    }
    if (search.searchTerm && search.searchTerm.length > 0) {
      try {
        trackPromise(
          fetchData(),
        );
      } catch (e) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const updateSearch = (criteria, value) => {
    if (criteria === 'indicators') {
      if (searchCriteria.indicators.includes(value)) {
        query.delete('indicators');
        searchCriteria.indicators.forEach((indicator) => {
          if (indicator !== value) {
            query.append('indicators', indicator);
          }
        });
      } else {
        query.append(criteria, value);
      }
    } else if (!value) {
      query.delete(criteria);
    } else {
      query.set(criteria, value);
    }
    history.push({ pathname: '/search', search: query.toString() });
    const updatedSearchCritera = getSearchCriteria(query);
    setSearch({
      ...updatedSearchCritera,
      chips: chips.map((c) => ({
        ...c,
        isSelected: updatedSearchCritera.indicators.includes(c.value),
      })),
    });
  };

  return {
    searchResults,
    searchCriteria,
    search,
    updateSearch,
    loading: promiseInProgress,
  };
};

export default useSearch;
