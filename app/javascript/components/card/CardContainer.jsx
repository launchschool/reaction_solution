import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import * as cardSelectors from '../../selectors/CardSelectors';
import * as boardSelectors from '../../selectors/BoardSelectors';
import * as commentSelectors from '../../selectors/CommentSelectors';
import * as actions from '../../actions/CardActions';

import Card from './Card';

class CardContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    title: '',
    card: undefined
  };

  componentDidMount() {
    const store = this.context.store;
    this.unsubscribe = store.subscribe(() => {
      this.updateCardInState();
      this.forceUpdate();
    });
    store.dispatch(actions.fetchCard(this.getCardId()));
  };

  componentWillUnmount() {
    this.unsubscribe();
  };

  updateCardInState = () => {
    const store = this.context.store;
    const card = cardSelectors.getCardById(store.getState(), this.getCardId());

    if (!_.isEqual(card, this.state.card)) {
      this.setState({
        card: card,
        title: card.title
      });
    }
  };

  getCardId = () => {
    const cardId = Number(this.props.match.params.cardId);
    return cardId;
  }

  handleTitleChange = (e) => {
    e.preventDefault();

    this.setState({
      title: e.target.value
    });
  };

  handleTitleBlur = (e) => {
    const store = this.context.store;

    store.dispatch(actions.updateCard(
      this.state.card.id,
      { title: this.state.title }
    ));
  };

  handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  toggleArchive = (archived) => {
    const store = this.context.store;

    store.dispatch(actions.updateCard(
      this.state.card.id,
      { archived }
    ));
  };

  handleArchiveClick = (e) => {
    this.toggleArchive(true);
  };

  handleUnarchiveClick = (e) => {
    this.toggleArchive(false);
  };

  gatherComments = (e) => {
    if (!this.state.card) { return []; }

    const store = this.context.store;

    return commentSelectors.cardComments(store.getState(), this.state.card.id, (a, b) => (
      new Date(b.created_at) - new Date(a.created_at)
    ));
  }

  render() {
    return (
      <Card 
        card={this.state.card}
        title={this.state.title}
        onTitleChange={this.handleTitleChange}
        onTitleBlur={this.handleTitleBlur}
        onTitleKeyPress={this.handleTitleKeyPress}
        onArchiveClick={this.handleArchiveClick}
        onUnarchiveClick={this.handleUnarchiveClick}
        comments={this.gatherComments()}
      />
    );
  };
}

export default CardContainer;
