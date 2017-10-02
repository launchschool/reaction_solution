import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';

import * as cardSelectors from '../../selectors/CardSelectors';
import * as boardSelectors from '../../selectors/BoardSelectors';
import * as commentSelectors from '../../selectors/CommentSelectors';
import * as actions from '../../actions/CardActions';

import Card from './Card';
import Popover from '../shared/Popover';
import DueDateForm from './DueDateForm';

class CardContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    title: '',
    card: undefined,
    popover: {
      visible: false,
      attachedTo: null,
      type: null
    }
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
    const store = this.context.store;

    return commentSelectors.cardComments(store.getState(), this.state.card.id, (a, b) => (
      new Date(b.created_at) - new Date(a.created_at)
    ));
  }

  handleShowPopover = (e, type) => {
    this.setState({
      popover: {
        type,
        attachedTo: e.target,
        visible: true
      }
    });
  };

  handleClosePopover = (e) => {
    e.preventDefault();
    this.closePopover();
  }

  handleDueDateSubmit = (e) => {
    e.preventDefault();

    const date = e.target.querySelector('.datepicker-select-date input').value;
    const time = e.target.querySelector('.datepicker-select-time input').value;
    const dateTime = `${date} ${time}`;

    const store = this.context.store;

    store.dispatch(actions.updateCard(this.state.card.id, {
      due_date: moment(dateTime, 'M/D/YYYY h:mm A').toISOString()
    }, () => {
      this.closePopover();
    }));
  }

  handleDueDateRemove = (e) => {
    e.preventDefault();

    const store = this.context.store;

    store.dispatch(actions.updateCard(this.state.card.id, {
      due_date: null,
      completed: false
    }, () => {
      this.closePopover();
    }));
  };

  handleToggleCompleted = (e) => {
    e.stopPropagation();

    const store = this.context.store;

    store.dispatch(actions.updateCard(this.state.card.id, {
      completed: !this.state.card.completed
    }));
  }

  closePopover = () => {
    this.setState({
      popover: {
        type: null,
        attachedTo: null,
        visible: false
      }
    });
  }

  popoverChildren() {
    if (this.state.popover.visible && this.state.popover.type) {
      switch(this.state.popover.type) {
        case 'due-date':
          return (
            <DueDateForm
              dueDate={this.state.card.due_date}
              onClose={this.handleClosePopover}
              onSubmit={this.handleDueDateSubmit}
              onRemove={this.handleDueDateRemove}
            />
          );
      }
    }
  }



  render() {
    if (this.state.card) {
      return (
        <div>
          <Card 
            card={this.state.card}
            title={this.state.title}
            onTitleChange={this.handleTitleChange}
            onTitleBlur={this.handleTitleBlur}
            onTitleKeyPress={this.handleTitleKeyPress}
            onArchiveClick={this.handleArchiveClick}
            onUnarchiveClick={this.handleUnarchiveClick}
            onToggleCompleted={this.handleToggleCompleted}
            showPopover={this.handleShowPopover}
            comments={this.gatherComments()}
          />
          <Popover {...this.state.popover}>
            {this.popoverChildren()}
          </Popover>
        </div>
      );
    } else {
      return null;
    }
  };
}

export default CardContainer;
