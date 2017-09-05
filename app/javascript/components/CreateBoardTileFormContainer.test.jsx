import React from 'react';
import store from '../lib/store';
import { mount } from 'enzyme';

import CreateBoardTileFormContainer from './CreateBoardTileFormContainer';

import apiClient from '../lib/api_client';

import { clearStoreData } from '../lib/redux_actions';

jest.mock('../lib/api_client');

describe("CreateBoardTileFormContainer", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CreateBoardTileFormContainer />, { context: { store } });
  });

  afterEach(() => {
    store.dispatch(clearStoreData());
  })

  describe("user submits the form with no title entered", () => {
    beforeEach(() => {
      const form = wrapper.find('form').first();
      form.simulate('submit', {
        preventDefault: function() {}
      });
    });

    it("doesn't add a board to the state", () => {
      expect(
        store.getState().boards
      ).toEqual([]);
    });
  });

  describe("user types a title", () => {
    const boardTitle = 'Awesome board';

    beforeEach(() => {
      const input = wrapper.find('input').first();
      input.simulate('change', {
        preventDefault: function() { },
        target: {
          value: boardTitle
        }
      });
    });

    it("updates the `title` store property", () => {
      expect(
        store.getState().newBoardForm.title
      ).toEqual(boardTitle);
    });

    describe("and submits the form", () => {
      beforeEach(() => {
        const form = wrapper.find('form').first();
        form.simulate('submit', {
          preventDefault: function() {}
        });
      });

      it("updates the `boards` store property", () => {
        const invocation = apiClient.createBoard.mock.calls[0];
        const callback = invocation[1];

        callback({
          id: "1",
          title: boardTitle
        });

        expect(
          store.getState().boards[0].title
        ).toEqual(boardTitle);
      });
    });
  });
});
