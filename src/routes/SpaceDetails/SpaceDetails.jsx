import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { getSpace } from '../../api';
import SpaceDetailsPage from '../../components/SpaceDetailsPage';
import { NameContext } from '../../context/NameContext';
import useError from '../../hooks/useError';

import getCategoryAndRating from '../../__mocks__/getCategoryAndRating';

const SpaceDetails = () => {
  const { setSpaceTitle, setSpaceData, spaceTitle } = useContext(NameContext);
  const { spaceId } = useParams();
  const [space, setSpace] = useState();
  const throwError = useError();

  useEffect(() => {
    async function fetchData() {
      const intId = parseInt(spaceId, 10);
      try {
        const { data } = await getSpace(intId);
        setSpace(data);
      } catch (e) {
        throwError(e);
      }
    }
    fetchData();
    // setPageStatus('spaceDetail');
  }, [spaceId]);

  // updating the state in name context
  useEffect(() => {
    if (space) {
      setSpaceData(space);
      setSpaceTitle(space.name);
    }
  }, [space]);

  return (
    <>
      {/* TODO: add average Rating & category props & name */}
      <SpaceDetailsPage
        category={getCategoryAndRating().category}
        averageRating={getCategoryAndRating().averageRating}
        space={space}
        spaceTitle={spaceTitle}
      />
    </>
  );
};

SpaceDetails.props = {
  space: PropTypes.shape({}),
};

export default SpaceDetails;
