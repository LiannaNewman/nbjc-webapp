/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Input from '@material-ui/core/Input';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography, Link } from '@material-ui/core';

import useQuery from '../../hooks/useQuery';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 100,
  },
  prompt: {
    display: 'flex',
    flexGrow: 2,
    width: '100%',
    marginTop: '40px',
    color: '#666666',
    fontSize: '16px',
  },
  mobilePrompt: {
    display: 'flex',
    flexGrow: 2,
    width: '100%',
    marginTop: '40px',
    color: '#666666',
    fontSize: '16px',
    flexDirection: 'column',
  },
  showingText: {
    flexGrow: 1,
    justifyContent: 'center',
    fontSize: '16px',
  },
  navigationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
  },
  mobileNavigationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  paginationButton: {
    height: '28px',
    width: '28px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 2px',
  },
  activeColor: {
    color: '#666666',
  },
  inactiveColor: {
    color: '#E5E5E5',
  },
  pageInputNavigation: {
    border: '1px solid #666666',
    width: '40px',
    borderRadius: '4px',
    height: '28px',
    marginLeft: '8px',
    backgroundColor: '#FFFFFF',
  },
  goToPageContainer: {
    backgroundColor: '#F2F2F2',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '4px',
    width: '153px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000000',
    marginTop: 8,
  },
  paginationListContainer: {
    display: 'flex',
  },
  mobilePaginationListContainer: {
    display: 'flex',
    marginTop: 44,
    justifyContent: 'center',
  },
  paginationLabel: {
    textDecoration: 'none',
    margin: '0 2px',
  },
  alignLabelAbsoluteCenter: {
    flex: 1,
  },
  expandNavigationButtons: {
    width: '28px',
    textAlign: 'center',
  },
  currentPageButton: {
    color: '#FFFFFF',
    backgroundColor: '#633AA3',
    borderRadius: '2px',
  },
  hideDisplay: {
    display: 'none',
  },
  buttonOpenGoToPage: {
    maxWidth: 28,
    maxHeight: 28,
    minWidth: 28,
    minHeight: 28,
    display: 'flex',
    justifyContent: 'center',
    margin: '0 2px',
  },
  goToPageLabel: {
    fontSize: 30,
    fontWeight: 700,
  },
});

const NextButton = ({ pageLink, classes }) => {
  const color = pageLink === undefined ? classes.inactiveColor : classes.activeColor;
  const removeUnderline = classes.paginationLabel;
  const nextClasses = `${color} ${removeUnderline} ${classes.expandNavigationButtons}`;
  return (
    <Link href={pageLink} aria-label="Go next page" className={nextClasses} underline="none">
      {'>'}
    </Link>
  );
};

const BackButton = ({ pageLink, classes }) => {
  const color = pageLink === undefined ? classes.inactiveColor : classes.activeColor;
  const removeUnderline = classes.paginationLabel;
  const backClasses = `${color} ${removeUnderline} ${classes.expandNavigationButtons}`;
  return (
    <Link href={pageLink} aria-label="Go previous page" className={backClasses} underline="none">
      {'<'}
    </Link>
  );
};

const GoToPage = ({ classes, totalPages, showButton }) => {
  const label = 'Go to page';
  const ShowContent = showButton ? undefined : classes.hideDisplay;
  const GoToPageClasses = `${classes.goToPageContainer} ${ShowContent}`;
  return (
    <div className={GoToPageClasses}>
      <span>{label}</span>
      <Input
        inputProps={{ min: 1, max: totalPages, style: { textAlign: 'center' } }}
        defaultValue={totalPages}
        className={classes.pageInputNavigation}
      />
    </div>
  );
};

const RangeOfResults = ({ classes, totalCount, calculateRange }) => (
  (totalCount > 0)
  && (
    <Typography variant="h5" align="center" className={classes.showingText}>
      {calculateRange}
    </Typography>
  )
);

const OpenGoToPageButton = ({ goToPageLabel, setShowButton, classes }) => {
  const [toggle, setToggle] = useState(true);
  const GoToClasses = `${classes.activeColor} ${classes.buttonOpenGoToPage}`;
  return (
    <Button
      className={GoToClasses}
      onClick={() => {
        setToggle(!toggle);
        setShowButton(toggle);
      }}
    >
      <span classNames={classes.goToPageLabel}>
        {goToPageLabel}
      </span>
    </Button>
  );
};

const PaginationButton = ({
  pageNumber,
  classes,
  goToPageLabel,
  currPage,
  link,
  setShowButton,
}) => {
  if (pageNumber === goToPageLabel) {
    return (
      <OpenGoToPageButton
        goToPageLabel={goToPageLabel}
        setShowButton={setShowButton}
        classes={classes}
      />
    );
  }
  const isCurrentPage = currPage === pageNumber ? classes.currentPageButton : '';
  const PaginationButtonClasses = `${classes.paginationLabel} ${isCurrentPage}`;
  return (
    <>
      <Link href={link} aria-label={`Go to page ${pageNumber}`} className={PaginationButtonClasses} underline="none">
        <div className={classes.paginationButton}>
          <span>{pageNumber}</span>
        </div>
      </Link>
    </>
  );
};

const RenderPaginationButtons = (
  {
    pagesToRender,
    classes,
    goToPageLabel,
    currPage,
    setShowButton,
  },
) => (
  pagesToRender.map((page) => (
    <PaginationButton
      pageNumber={page.pageNumber}
      classes={classes}
      goToPageLabel={goToPageLabel}
      currPage={currPage}
      link={page.link}
      setShowButton={setShowButton}
    />
  ))
);

const calculatePaginationMenu = (totalPages, page, labelForGoToPage, history, query, perPage) => {
  let pagesToRender = {
    prevPage: ((totalPages > 1 && page > 1) ? page - 1 : null),
    currPage: page,
    nextPage: ((page + 1 < totalPages) ? page + 1 : null),
    nextNextPage: ((page + 2 < totalPages) ? page + 2 : null),
    ellipsis: ((page + 3 <= totalPages) ? labelForGoToPage : null),
    lastPage: ((totalPages !== page) ? totalPages : null),
  };
  pagesToRender = Object.values(pagesToRender).filter((pgNum) => pgNum !== null);
  const pagesWithLinks = pagesToRender.map((pg) => {
    const base = history.location.pathname;
    query.set('page', pg);
    query.set('perPage', perPage);
    return { pageNumber: pg, link: `${base}?${query.toString()}` };
  });
  return pagesWithLinks;
};

const Pagination = ({
  totalCount,
  page,
  perPage,
  classes,
}) => {
  const useDesktop = useMediaQuery('(min-width:838px)');
  const [showButton, setShowButton] = useState(false);
  const query = useQuery();
  const history = useHistory();
  const totalPages = Math.ceil(totalCount / perPage);
  let backButton;
  let backExists;
  let nextExists;
  let nextButton;

  const paginationListClasses = useDesktop
    ? classes.paginationListContainer : classes.mobilePaginationListContainer;
  const navigationContainerClasses = useDesktop
    ? classes.navigationContainer : classes.mobileNavigationContainer;
  const promptClasses = useDesktop ? classes.prompt : classes.mobilePrompt;

  const labelForGoToPage = '...';
  if (totalPages > 1 && page > 1) {
    const backLink = history.location.pathname;
    backExists = true;
    query.set('page', page - 1);
    query.set('perPage', perPage);
    backButton = `${backLink}?${query.toString()}`;
  }
  if (totalPages > 1 && page < totalPages) {
    const nextLink = history.location.pathname;
    nextExists = true;
    query.set('page', page + 1);
    query.set('perPage', perPage);
    nextButton = `${nextLink}?${query.toString()}`;
  }

  const CalculatePageRange = () => {
    const startingRange = (page - 1) * perPage + 1;
    const endingRange = (page) * perPage < totalCount ? (page) * perPage : totalCount;
    const resultString = endingRange <= 1 ? 'Result' : 'Results';
    return `Showing ${startingRange} - ${endingRange} of ${totalCount} ${resultString}`;
  };

  return (
    <div className={classes.root}>
      <div className={promptClasses}>
        <div className={classes.alignLabelAbsoluteCenter} />
        <div>
          <RangeOfResults
            totalCount={totalPages}
            classes={classes}
            calculateRange={CalculatePageRange()}
          />
        </div>
        <div className={navigationContainerClasses}>
          {(backExists || nextExists) && (
            <>
              <div className={paginationListClasses}>
                <BackButton pageLink={backButton} classes={classes} />
                <RenderPaginationButtons
                  pagesToRender={
                    calculatePaginationMenu(totalPages, page,
                      labelForGoToPage, history, query, perPage)
                  }
                  classes={classes}
                  goToPageLabel={labelForGoToPage}
                  currPage={page}
                  setShowButton={setShowButton}
                />
                <NextButton pageLink={nextButton} classes={classes} />
              </div>
              <GoToPage totalPages={totalPages} classes={classes} showButton={showButton} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

Pagination.defaultProps = {};

export default withStyles(styles)(Pagination);
