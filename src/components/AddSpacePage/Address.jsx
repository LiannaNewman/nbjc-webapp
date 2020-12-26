import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { businessProps } from '../../types';
import BusinessResultCard from '../BusinessResultCard';

const styles = (theme) => ({
  listWrapper: {
    display: 'flex',
    flexBasis: 'auto',
    flexWrap: 'wrap',
    maxHeight: 500,
    overflow: 'scroll',
    [theme.breakpoints.up('mobile')]: {
      maxHeight: 560,
    },
  },
  card: {
    margin: '20px',
  },
  footer: {
    margin: 20,
  },
  submitButton: {
    float: 'right',
    marginBottom: 20,
  },
});

const Address = ({
  businessList, classes, onBack, onNext,
}) => {
  const matches = useMediaQuery('(min-width:376px)');
  const [selected, setSelected] = useState();
  const onCheck = (index) => {
    if (selected === index) {
      setSelected();
    } else {
      setSelected(index);
    }
  };

  return (
    <>
      <Typography variant={matches ? 'h4' : 'subtitle1'} align="center">Select the location of the space you want to submit to OurGuide</Typography>
      <div className={classes.listWrapper}>
        {businessList.map((business, index) => (
          <BusinessResultCard
            business={business}
            key={business.id}
            checked={selected === index}
            onCheck={() => onCheck(index)}
            overrideClasses={{ resultCard: classes.card }}
          />
        ))}
      </div>
      <div className={classes.footer}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.submitButton}
          fullWidth={!matches}
          disabled={selected === undefined}
          onClick={onNext}
          disableElevation
        >
          Next
        </Button>
        <Button
          type="cancel"
          variant="outlined"
          color="secondary"
          fullWidth={!matches}
          onClick={onBack}
          disableElevation
        >
          Back
        </Button>

      </div>
    </>
  );
};

Address.propTypes = {
  businessList: PropTypes.arrayOf(PropTypes.shape(businessProps)).isRequired,
  classes: PropTypes.shape({}).isRequired,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

Address.defaultProps = {
  onNext: () => {},
  onBack: () => {},
};

export default withStyles(styles)(Address);
