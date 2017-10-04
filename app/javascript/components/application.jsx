import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import TopNav from './shared/TopNav';
import BoardsDashboardContainer from './dashboard/BoardsDashboardContainer';
import BoardContainer from './board/BoardContainer';
import CardContainer from './card/CardContainer';

import { fetchBoards } from '../actions/BoardActions';

class Application extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount() {
    const store = this.context.store;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
    this.context.store.dispatch(fetchBoards());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const state = this.context.store.getState();

    return (
      <div className={state.colors.colorblind ? 'colorblind' : ''}>
        <TopNav />

        <Route path='/(boards|cards)/:id' exact component={BoardContainer} />
        <Route path='/cards/:cardId' exact component={CardContainer} />

        <Route path='/' exact component={BoardsDashboardContainer} />
      </div>
    );
  }
}

export default Application;
