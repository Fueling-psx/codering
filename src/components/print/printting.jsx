require('sources/bower_components/bower-pt-sans/styles/pt_sans.css')
require('styles/ubuntu-mono-font.less')
require('styles/print/printing.less');

import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import codeStr from './data';
import selectedInstance from './selectedInstance';
import LineChart from './lineChart';



var typing = React.createClass({
	getInitialState: function() {
		return {
			codeFullArr: [],
			lineArr: [0],
			page: 0,
			items: [],
			end: false,
			codeIndex: 0,
			preValue: "",
			currentValue: "",
			codeIndex: 0,
			start: false,
			fontSize: "18",
			visible: true
		};
	},
	componentWillMount: function() {
		this.nextPage();
	},
	componentDidMount: function() {
		var _self = this;
		this.refs.nameInput.focus();
		this.refs.nameInput.onblur = function(){
			_self.refs.nameInput.focus();
		};

	},
	nextPage: function(){
		if (this.state.end) return;
		var page = this.state.page + 1;
		var lineArr = this.state.lineArr;
		var currentTopline = lineArr[page-1];
		var codeAllArr = codeStr.split(/\n/);
		var nextTopline = lineArr[page]? lineArr[page]: null;
		var items = [];
		if (nextTopline) {
			items = codeAllArr.slice(currentTopline,nextTopline);
		}else{
			items = codeAllArr.slice(currentTopline);
			
			var blockL = 0,blockR = 0,i = 0;
			for(var v1 of items){
				i++;
				if (v1.indexOf('{') != -1) {
					blockL++;
					if (i>30 || (i > 10 && blockL > blockR+1)) break;
				}
				if(v1.indexOf('}') != -1) {
					if (blockL>0) blockR++;
					if (i>=20 && blockL==blockR) break;
				}
			}
			items = codeStr.split(/\n/).slice(currentTopline,currentTopline+i);
		}
		if (lineArr[lineArr.length-1] < lineArr[page-1]+i) {
			lineArr.push(lineArr[page-1]+i);
			this.setState({
				lineArr: lineArr
			})
		}
		if (lineArr[page-1]+i == codeAllArr.length) {
			this.setState({
				end: true,
			})
		}
		this.setState({
			items: items,
			page: page,
			codeIndex: 0
		},function(){
			this.getCode();
		});
		
	},
	previousPage: function(){
		var lineArr = this.state.lineArr;
		var page = this.state.page;
		if (page == 1) return;
		var currentTopline = lineArr[page-1];
		var previousTopline = lineArr[page-2];
		var items = codeStr.split(/\n/).slice(previousTopline,currentTopline);
		this.setState({
			page: page-1,
			items: items,
			end: false,
			codeIndex: 0,
		},function(){
			this.getCode();
		});
		
	},
	skipT: function(nextValue){
		var codeIndex = this.state.codeIndex,
			codeFullArr = this.state.codeFullArr;
		if (nextValue == '\t') {
			this.setState({
				preValue: "",
				currentValue: '\t',
				codeIndex: codeIndex + 1,
			},function(){
				this.skipT(codeFullArr[codeIndex]["code"]);
			});
		}else if(nextValue == '\n'){
			this.setState({
				preValue: "",
				currentValue: '\n',
				codeIndex: codeIndex + 1,
			},function(){
				this.skipT(codeFullArr[codeIndex]["code"]);
			});
		}
	},
	pageInit: function(){
		this.skipT(this.state.codeFullArr[0]["code"]);
	},
	bind: function(){
		var _self = this;
		document.onkeydown = function (e){
			var keyNum = window.event?e.keyCode: e.which,
				codeFullArr = _self.state.codeFullArr,
				codeIndex = _self.state.codeIndex;
			if (keyNum == 13&&(codeFullArr[codeIndex]["code"] == '\n')){
				_self.setState({
					preValue: "",
					currentValue: '\n',
					codeIndex: codeIndex + 1,
				});
			}else if (keyNum == 8) {
				if (codeFullArr[codeIndex]["erroring"]) {
					codeFullArr[codeIndex]["back"] = true;
					codeFullArr[codeIndex]["style"] = codeFullArr[codeIndex]["style"].replace("incorrect","");
					codeFullArr[codeIndex]["erroring"] = false;
					_self.setState({
						codeFullArr: codeFullArr,
						currentValue: codeFullArr[codeIndex]["code"]
					})
				}else{
					_self.setState({
						codeIndex: codeIndex == 0 ? codeIndex : codeIndex - 1,
						codeFullArr: codeFullArr,
						currentValue: codeIndex == 0 ? codeFullArr[codeIndex]["code"]:codeFullArr[codeIndex - 1]["code"]
					})
				}
							
			}
			var nextValue = _self.state.codeFullArr[_self.state.codeIndex]["code"];
			_self.skipT(nextValue);
		}
	},
	handleChange: function(event){
		this.bind();
		var codeFullArr = this.state.codeFullArr,
			codeIndex = this.state.codeIndex;
		if (!this.state.start) this.setState({start: true});
		if (codeFullArr[codeIndex]["errored"]) {
			if (codeFullArr[codeIndex]["code"] == event.target.value) {
				codeFullArr[codeIndex]["correct"] = true;
				codeFullArr[codeIndex]["back"] = false;
			}
			this.setState({
				preValue: "",
				currentValue: event.target.value,
				codeIndex: this.state.codeIndex + 1,
				codeFullArr: codeFullArr
			});
			
		}else{
			if (codeFullArr[codeIndex]["code"] == event.target.value){
				this.setState({
					preValue: "",
					currentValue: event.target.value,
					codeIndex: this.state.codeIndex + 1,
					codeFullArr: codeFullArr
				});
			}else{
				var arr = this.state.codeFullArr;
				arr[this.state.codeIndex]["errored"] = true;
				arr[this.state.codeIndex]["erroring"] = true;
				arr[this.state.codeIndex]["style"] += " incorrect";
				this.setState({
					codeFullArr: arr
				})	
			}
				
		}
			
	},
	handleCheckedChange: function(e){
		alert(e);
	},
	AddCodeStyle: function(codeArr){
		var note = false,codeFullArr = [];
		for (var i = 0; i < codeArr.length; i++) {
			codeFullArr[i] = [];
			codeFullArr[i]["code"] = codeArr[i];
			codeFullArr[i]["errored"] = false;
			codeFullArr[i]["erroring"] = false;
			codeFullArr[i]["correct"] = false;
			codeFullArr[i]["back"] = false;
			if (codeArr[i] == "/" && codeArr[i+1]=="/") note = true;
			else if(codeArr[i] == "\n"){
				note = false;
				codeFullArr[i]["style"] = "return";
			}else{
				codeFullArr[i]["style"] = "p";
			}
			if (note) codeFullArr[i]["style"] = " note";
		}
		
		return codeFullArr;
	},
	getCode: function(){	
		var items = this.state.items;
		var codeArr = [];
		for(var v1 of items){
			for(var v2 of v1.split("")){
				codeArr.push(v2);
			}
			codeArr.push('\n');
		}
		var codeFullArr =  this.AddCodeStyle(codeArr);
		this.setState({
			codeFullArr: codeFullArr,
		},function(){
			this.pageInit();
		});
	},
	gameState: function(){
		this.setState({
			start: !this.state.start
		})


	},
	gameRestart: function(){

	},
	show: function() {
        this.setState({ visible: true });
    },
    hide: function() {
        this.setState({ visible: false });
    },
	render: function(){
		var codeFullArr = this.state.codeFullArr;
		var codeIndex = this.state.codeIndex;
		var i = -1;

		return  (
			<div id="main-wrapper">
				<div className="main">
					<div>
		                <button onClick={this.show}>show</button>

		                <Rodal visible={this.state.visible} onClose={this.hide} width={700} height={400} animation="flip">
		                    {LineChart}
		                </Rodal>
		            </div>
					<div className="mheader">
						<div className="tog-con">
							<div className="toggle">
								<input type="checkbox"/>
								<span className="button"></span>
								<span className="label">+</span>
							</div>
							<div className="toggle">
								<input type="checkbox"/>
								<span className="button"></span>
								<span className="label">–</span>
							</div>
						</div>
						{selectedInstance}
					</div>
					<pre>
						{	
							codeFullArr.map(function(item){
								i++;
								return <span className={codeIndex == i? "char-active " + codeFullArr[i]["style"]:codeFullArr[i]["style"]} key={'re'+i}>{item["code"]}</span>
							})
						}
					</pre>
					<div className="main-footer">
						<div className="pageing">
							<span onClick={this.previousPage}>上一页</span>
							<span onClick={this.nextPage}>下一页</span>	
						</div>
						<div className="time">
							<span>00:00</span>
							<span>开始/暂停</span><span className="" onClick={this.gameState}><img src={this.state.start?"images/pause.svg":"images/play.svg"} alt=""/></span>
							<span>重新开始</span><span className="" onClick={this.gameRestart}><img src="images/spinner.svg" alt=""/></span>
						</div>
					</div>
					<input type="text" value={this.state.preValue} onChange={this.handleChange} ref="nameInput" />
					</div>
			</div>
		)
	}
});

export default typing;
