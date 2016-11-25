require('styles/reset.less');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Header from './header';
import Footer from './footer';

const App = React.createClass({
	render: function(){
		return (
			<div>
				<Header />
				{this.props.children}
				<Footer />
			</div>
  		);
	}
});



export default App;