import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { getSpace } from '../../api';
import SpaceDetailsPage from '../../components/SpaceDetailsPage';
import { NameContext } from '../../context/NameContext';

import getCategoryAndRating from '../../__mocks__/getCategoryAndRating';
import getAllReviews from '../../__mocks__/getAllReviewsMock';

const SpaceDetails = () => {
  const { setSpaceTitle, setSpaceData, spaceTitle } = useContext(NameContext);
  const { spaceId } = useParams();
  const [space, setSpace] = useState();

  useEffect(() => {
    async function fetchData() {
      const intId = parseInt(spaceId, 10);
      // todo: add validation to number.
      const { data } = await getSpace(intId);
      setSpace(data);
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
      <SpaceDetailsPage
        category={getCategoryAndRating().category}
        averageRating={getCategoryAndRating().averageRating}
        space={space}
        spaceTitle={spaceTitle}
        totalReviews={getAllReviews().totalReviews}
      />
    </>
  );
};

SpaceDetails.props = {
  space: PropTypes.shape({}),
};

export default SpaceDetails;
