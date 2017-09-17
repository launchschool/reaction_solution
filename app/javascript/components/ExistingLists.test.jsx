import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from '../lib/Store';

import ExistingLists from './ExistingLists';

describe("ExistingLists", () => {
  it("sorts lists by position", () => {
    const lists = [
      { id: 1, title: "My first list", position: 3 },
      { id: 2, title: "My second list", position: 1 },
      { id: 3, title: "My third list", position: 2 },
    ];
    const wrapper = mount(
      <Provider store={createStore()}>
        <ExistingLists lists={lists} />
      </Provider>
    );
    const titles = wrapper.find('.list-title').map(title => title.prop('value'));

    expect(titles).toEqual(["My second list", "My third list", "My first list"]);
  });
});
