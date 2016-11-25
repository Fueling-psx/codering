import React from 'react';
import AMUIReact from 'amazeui-react';

let Selected = AMUIReact.Selected;
let ButtonToolbar = AMUIReact.ButtonToolbar;

let data = [
  {value: '50', label: '50'},
  {value: '75', label: '75'},
  {value: '100', label: '100'}
];

let props = {
  data: data,
  onChange: function(value) {
    console.log('当前值为：', value);
  }
}


let selectedInstance = (
  <ButtonToolbar>
    <Selected {...props} btnStyle="primary" placeholder="显示行数"/>
  </ButtonToolbar>
);

export default selectedInstance;