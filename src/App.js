import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Home from './pageComponents/Home';
import Starred from './pageComponents/Starred';
import Show from './pageComponents/Show';

const theme = {
  mainColors: {
    blue: '#2400ff',
    gray: '#c6c6c6',
    dark: '#353535',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/starred">
          <Starred />
        </Route>

        <Route exact path="/show/:id">
          <Show />
        </Route>

        <Route>
          <div>Error 404: Page not found</div>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
