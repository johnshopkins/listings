/* global module: false */

module.exports = {

  App: require('./views/App'),
  Container: require('./views/ContainerView'),
  ControlsToggle: require('./views/ControlsToggleView'),
  Controls: require('./views/ControlsView'),
  Items: require('./views/ItemsView'),
  Pagination: require('./views/PaginationView'),
  State: require('./views/StateView'),

  controls: {
    CheckboxSet: require('./views/controls/CheckboxSetView'),
    Checkbox: require('./views/controls/CheckboxView'),
    ControlSet: require('./views/controls/ControlSetView'),
    Control: require('./views/controls/ControlView'),
    SearchSet: require('./views/controls/SearchSetView'),
    Search: require('./views/controls/SearchView')
  },

  pagination: {
    Item: require('./views/pagination/ItemView'),
    LinkedItem: require('./views/pagination/LinkedItemView')
  }

};
