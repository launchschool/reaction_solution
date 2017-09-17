import React from 'react';
import PropTypes from 'prop-types';

import EditableTitle from './EditableTitle';

import * as actions from '../actions/ListActions';

class EditableListTitle extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  state = {
    title: this.props.list.title
  };

  handleBlur = (e) => {
    this.context.store.dispatch(
      actions.updateList(
        this.props.list.board_id,
        this.props.list.id,
        { title: e.target.value }
      )
    );
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') { e.target.blur(); }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  render() {
    return (
      <EditableTitle 
        childClassName='list-title'
        title={this.state.title} 
        onBlur={this.handleBlur}
        onKeyPress={this.handleKeyPress}
        onChange={this.handleChange}
      />
    );
  }
};

export default EditableListTitle;