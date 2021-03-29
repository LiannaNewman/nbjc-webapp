/* eslint-disable no-unneeded-ternary */
import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import {
  Switch, Route, useRouteMatch,
} from 'react-router-dom';

import AppBar from './components/AppBar';
import NameContextProvider from './context/NameContext';
import UserContextProvider from './context/UserContext';

import theme from './theme';
import routes, { spaceRoutes } from './routes';
import NotFound from './routes/NotFound';
import UnknownError from './routes/UnknownError';
import ErrorBoundary from './components/ErrorBoundary';

function Spaces() {
  const match = useRouteMatch();
  const spaceKeys = ['addSpace', 'addReview', 'spaceDetails', 'reviews'];
  return (
    <Switch>
      {spaceRoutes.map((route) => (
        <Route
          key={`${match.path}${route.path}`}
          path={`${match.path}${route.path}`}
          exact={route.exact === false ? false : true}
        >
          <AppBar
            routes={[...routes, ...spaceRoutes].filter((r) => !r.skipAppBar).map((r) => ({
              label: r.label,
              path: (spaceKeys.includes(r.key) ? `/spaces${r.path}` : r.path),
              key: r.key,
              icon: r.icon,
            }))}
            selected={route.key}
          />
          <ErrorBoundary>
            <route.content />
          </ErrorBoundary>
        </Route>
      ))}
    </Switch>
  );
}

function App() {
  const spaceKeys = ['addSpace', 'addReview', 'spaceDetails', 'reviews'];
  return (
    <>
      <UserContextProvider>
        <NameContextProvider>
          <ThemeProvider theme={theme}>
            <div className="App">
              <Switch>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === false ? false : true}
                  >
                    <AppBar
                      routes={[...routes, ...spaceRoutes]
                        .filter((r) => !r.skipAppBar).map((r) => ({
                          label: r.label,
                          path: (spaceKeys.includes(r.key) ? `/spaces${r.path}` : r.path),
                          key: r.key,
                          enforceLogin: r.enforceLogin,
                          icon: r.icon,
                        }))}
                      selected={route.key}
                    />
                    <ErrorBoundary>
                      <route.content />
                    </ErrorBoundary>
                  </Route>
                ))}
                {/* /spaces, /spaces/:id, /spaces/new, /spaces/ */}
                <Route path="/spaces">
                  <Spaces />
                </Route>
                <Route path="/500">
                  <AppBar
                    routes={[...routes, ...spaceRoutes]
                      .filter((r) => !r.skipAppBar).map((r) => ({
                        label: r.label,
                        path: (spaceKeys.includes(r.key) ? `/spaces${r.path}` : r.path),
                        key: r.key,
                        enforceLogin: r.enforceLogin,
                        icon: r.icon,
                      }))}
                    selected={null}
                  />
                  <UnknownError />
                </Route>
                <Route>
                  <AppBar
                    routes={[...routes, ...spaceRoutes]
                      .filter((r) => !r.skipAppBar).map((r) => ({
                        label: r.label,
                        path: (spaceKeys.includes(r.key) ? `/spaces${r.path}` : r.path),
                        key: r.key,
                        enforceLogin: r.enforceLogin,
                        icon: r.icon,
                      }))}
                    selected={null}
                  />
                  <NotFound />
                </Route>
              </Switch>
            </div>
          </ThemeProvider>
        </NameContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
