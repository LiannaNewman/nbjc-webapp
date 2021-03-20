import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import withUser from '../AuthenticatedRoute';
// todo: change to use api.
import getYelpResultsMock from '../../__mocks__/getYelpResultMock';
import chips from '../../api/chips';

import {
  AddSpaceSearch,
  AddSpaceAddress,
  AddSpaceAttributes,
  AddSpaceReview,
  AddSpaceSubmit,
  AddSpaceSuccess,
} from '../../components/AddSpacePage';

import ErrorSnackbar from '../../components/ErrorSnackbar';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      margin: '0 20px',
    },
    [theme.breakpoints.up('mobile')]: {
      margin: '0 100px',
    },
  },
  stepper: {
    justifyContent: 'center',
    paddingTop: 0,
  },
  step: {
    cursor: 'pointer',
  },
  stepLabel: {
    '& .MuiStepIcon-root': {
      width: 30,
      height: 30,
      [theme.breakpoints.up('mobile')]: {
        width: 50,
        height: 50,
      },
    },
  },
});

const getMockBusiness = (count = 10) => [...Array(count)].map((_, i) => getYelpResultsMock({ id: `${i}` }));

const getStepContent = (step, {
  onBack,
  onNext,
  onSubmit,
  disableNext,
}, formValues) => {
  switch (step) {
    case 0:
      return (
        <AddSpaceSearch
          onNext={onNext}
          disableNext={disableNext}
          addSpaceProps={formValues}
        />
      );
    case 1:
      return (
        <AddSpaceAddress
          businessList={getMockBusiness()}
          onBack={onBack}
          onNext={onNext}
          addSpaceProps={formValues}
        />
      );
    case 2:
      return (
        <AddSpaceAttributes
          chips={chips}
          onBack={onBack}
          onNext={onNext}
          addSpaceProps={formValues}
        />
      );
    case 3:
      return <AddSpaceReview onBack={onBack} onNext={onNext} addSpaceProps={formValues} />;
    case 4:
      return (
        <AddSpaceSubmit
          onBack={onBack}
          onSubmit={onSubmit}
          addSpaceProps={formValues}
        />
      );
    case 5:
      return (
        <AddSpaceSuccess />
      );
    default:
      return 'Unknown step';
  }
};

const getSteps = () => ['Add space', 'Address', 'Attributes', 'Rate and Review', 'Submit'];

const AddSpace = ({ classes }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const steps = getSteps();
  const onNext = (data) => {
    if (activeStep === 0) {
      // todo: call yelp api
      if (data && data.name === 'error') {
        setSnackbarOpen(true);
        return;
      }
    }
    setFormValues({
      ...formValues,
      ...data,
    });
    setActiveStep(activeStep + 1);
  };
  const onSubmit = (space) => {
    // todo: contact api
    console.log('Space details', space);
    setActiveStep(5);
  };

  const stepProps = {
    onBack: (step) => {
      if (step > -1 && step < 6) {
        return setActiveStep(step);
      }
      return setActiveStep(activeStep - 1);
    },
    onNext,
    onSubmit,
    disableNext: snackbarOpen,
  };

  return (
    <div className={classes.root}>
      {activeStep !== 5 && (
        <Stepper
          activeStep={activeStep}
          connector={null}
          className={classes.stepper}
        >
          {steps.map((label, index) => (
            <Step
              color="secondary"
              key={label}
              onClick={() => {
                if (index < activeStep && activeStep !== 5) {
                  setActiveStep(index);
                }
              }}
              className={classes.step}
            >
              {activeStep === index && (
                <StepLabel className={classes.stepLabel} color="secondary">
                  {label}
                </StepLabel>
              )}
              {activeStep !== index && (
                <StepLabel className={classes.stepLabel} color="secondary" />
              )}
            </Step>
          ))}
        </Stepper>
      )}
      <div>{getStepContent(activeStep, stepProps, formValues)}</div>
      <ErrorSnackbar
        snackbarOpen={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        body="We could not find the space. Please try again or contact Support."
      />
    </div>
  );
};

AddSpace.prototypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withUser(withStyles(styles)(AddSpace));
