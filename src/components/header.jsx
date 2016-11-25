require('styles/header.less');

import React from 'react';
import { Router, Route, Link } from 'react-router';


const header = React.createClass({
	getInitialState: function() {
		return ({
			login: false
		});
	},
	handleLogin: function(){
		
	},
	render: function(){
		var state = this.state;
		return (
			<div id="header-wrapper">
				<div className="header">
					<div className="logo">
						<Link to="/Home" className="lo"><span className="t">coding</span>.io</Link>
					</div>
					<div className="sub-nav">
						<ul>
							<li>
								<Link to="/Home">首页</Link>
							</li>
							<li>
								<Link to="/print">打字页</Link>
							</li>
							<li>
								<div className={state.login?"userwrapper":"userWrapper signin"}>
									<div className="user">
										<span className="user popOutBtn">
											<a href=""><span className="username">jiweixia66</span></a>
										</span>
										<span className="bubble">
											<a className="popOutBtn signout" href="">登出</a>
										</span>
									</div>
									<div className="NewComer">
										<a className="popOutBtn signin" onClick={this.handleLogin}>登录/注册</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
	  			</div>			
			</div>
			
  		);
	}
});

export default header;