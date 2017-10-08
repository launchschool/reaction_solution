import React from 'react';
import PropTypes from 'prop-types';

const NewBoardForm = (props) => (
  <div>
    <header>
      <span>Create Board</span>
      <a 
        href="#" 
        className="icon-sm icon-close"
        onClick={props.onCloseClick}
      ></a>
    </header>
    <div className="content">
      <form
        onSubmit={props.onSubmit}
      >
        <dl>
          <dt>Title</dt>
          <dd>
            <input 
              type="text" 
              placeholder='Like "Publishing Calendar"...' 
              value={props.title}
              onChange={props.onTextChange}
            />
          </dd>
        </dl>
        <button className="button" type="submit">Create</button>
      </form>
    </div>
  </div>
);

NewBoardForm.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default NewBoardForm;
