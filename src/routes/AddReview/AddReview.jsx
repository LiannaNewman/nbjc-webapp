import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import {
  getReviewForSpaceAndUser,
  getSpace,
  postReview,
} from '../../api';
import Review from '../../components/AddSpacePage/Review';
import Success from '../../components/AddSpacePage/Success';
import ErrorSnackbar from '../../components/ErrorSnackbar';

import withUser from '../AuthenticatedRoute';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      margin: '0 20px',
    },
    [theme.breakpoints.up('mobile')]: {
      margin: '0 100px',
    },
  },
  reviewSubtitle: {
    [theme.breakpoints.up('xs')]: {
      marginBottom: 60,
    },
    [theme.breakpoints.up('mobile')]: {
      marginBottom: 40,
    },
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewSubmit: {
    [theme.breakpoints.up('mobile')]: {
      width: 254,
    },
  },
  successFooter: {
    display: 'block !important',
  },
  successButton: {
    [theme.breakpoints.up('mobile')]: {
      width: 254,
    },
    margin: '0 auto',
    display: 'block',
    marginBottom: 40,
  },
});

const AddReview = ({ classes }) => {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [pageStatus, setPageStatus] = useState('review');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    async function fetchData() {
      const intId = parseInt(spaceId, 10);
      const [spaceData, reviewData] = await Promise.all([
        getSpace(intId),
        // todo: add actual user_id
        getReviewForSpaceAndUser({ spaceId: intId, userId: 1 }),
      ]);
      if (reviewData.data.exists) {
        setSpace(spaceData.data);
        setPageStatus('reviewExists');
      } else {
        setSpace(spaceData.data);
      }
    }
    try {
      fetchData();
      setPageStatus('review');
    } catch (e) {
      setSnackbarOpen(true);
    }
  }, [spaceId]);

  const saveReview = (formData) => {
    trackPromise(
      postReview({
        spaceId,
        rating: formData.rating,
        detail: formData.review,
        anonymous: formData.anon,
      })
        .then(() => {
          setPageStatus('success');
        })
        .catch(() => {
          setSnackbarOpen(true);
        }),
    );
  };

  return (
    <div className={classes.root}>
      {space && pageStatus === 'review' && (
        <Review
          title={(isDesktop) => (
            <>
              <Typography variant={isDesktop ? 'h2' : 'h4'} align="center">
                Rate and Review
              </Typography>
              <Typography
                variant={isDesktop ? 'h4' : 'subtitle1'}
                align="center"
                className={classes.reviewSubtitle}
              >
                {`You can rate ${space.name} anonymously.`}
              </Typography>
            </>
          )}
          showBack={false}
          submitLabel="Submit"
          onNext={saveReview}
          disableSubmit={() => promiseInProgress}
          overrideClasses={{
            footer: classes.reviewFooter,
            submitButton: classes.reviewSubmit,
          }}
        />
      )}
      {space && pageStatus === 'success' && (
        <Success
          title="Your Review Was Submitted!"
          subtitle={`Thank you for rating and reviewing ${space.name} on OurGuide.`}
          primaryButton={(isDesktop) => (
            <Button
              variant="contained"
              align="center"
              fullWidth={!isDesktop}
              href={`/spaces/${space.id}`}
              color="primary"
              disableElevation
              className={classes.successButton}
            >
              Go to space
            </Button>
          )}
          overrideClasses={{
            buttonWrapper: classes.successFooter,
            secondaryButton: classes.successButton,
          }}
        />
      )}
      {space && pageStatus === 'reviewExists' && (
        <Success
          title="Your Review exists for this space"
          subtitle="You have already submitted your review for this space"
          primaryButton={(isDesktop) => (
            <Button
              variant="contained"
              align="center"
              fullWidth={!isDesktop}
              href={`/spaces/${space.id}`}
              color="primary"
              disableElevation
              className={classes.successButton}
            >
              Go to space
            </Button>
          )}
          overrideClasses={{
            buttonWrapper: classes.successFooter,
            secondaryButton: classes.successButton,
          }}
        />
      )}
      {!space && <CircularProgress color="secondary" />}
      <ErrorSnackbar
        snackbarOpen={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        body="There was an error posting the reivew. Please try again later"
      />
    </div>
  );
};

AddReview.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withUser(withStyles(styles)(AddReview));
