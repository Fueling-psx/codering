require('sources/bower_components/bower-pt-sans/styles/pt_sans.css')
require('styles/ubuntu-mono-font.less')
require('styles/print/printing.less');

import React from 'react';
import codeStr from './data';
import Result from './result';
import {Button,ModalTrigger,Modal} from 'amazeui-react';
import $ from 'jquery';



var typing = React.createClass({
	getInitialState: function() {
		return {
			pageCodeArr: [],
			codeAllArr: [],
			lineArr: [0],
			page: 0,
			items: [],
			pageEnd: false,
			InvalidCode: 0,
			end: false,
			codeIndex: 0,
			preValue: "",
			currentValue: "",
			start: false,
			fontSize: 18,
			pageLine: 15,
			begin: true,
			showResult: true,
			typed: 0,
			backspacing: 0,
			timeIndex: 0,
			fontMax: false,
			fontMin: false,
		};
	},
	componentWillMount: function() {
		let codeAllArr = codeStr.split(/\n/);
		this.setState({
			codeAllArr: codeAllArr
		})
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
		this.setState({
			page: this.state.page + 1,
			showResult: false,
		},function(){
			this.setItems();
		});
	},
	previousPage: function(){
		if (this.state.page == 1) return;
		this.setState({
			page: this.state.page-1,
			end: false,
		},function(){
			this.setItems();
		});
		
	},
	setItems: function(){
		var page = this.state.page,
			codeAllArr = this.state.codeAllArr,
			pageLine = this.state.pageLine,
			items = codeAllArr.slice((page-1)*pageLine,page*pageLine);
		if (page >= codeAllArr.length) this.setState({end: true});
		this.setState({items: items,codeIndex: 0},function(){
			this.getCode();
		});

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
		var pageCodeArr =  this.AddCodeStyle(codeArr);
		this.setState({
			pageCodeArr: pageCodeArr,
		},function(){
			this.pageInit();
		});
	},
	skipT: function(currentValue,bol){
		var codeIndex = this.state.codeIndex,
			pageCodeArr = this.state.pageCodeArr;
		// console.log(bol);
		if (currentValue == '\t'||(currentValue == ' '&&bol)||currentValue == '\n') {
			pageCodeArr[codeIndex]["corrected"] = true;
			this.setState({
				preValue: "",
				currentValue: currentValue,
				codeIndex: codeIndex + 1,
				pageCodeArr: pageCodeArr,
				InvalidCode: this.state.InvalidCode + 1,
			},function(){
				this.skipT(pageCodeArr[this.state.codeIndex]["code"],true);
			});
		}else{
			this.setState({begin: false});
		}
	},
	pageInit: function(){
		this.skipT(this.state.pageCodeArr[0]["code"],true);
	},
	bind: function(){
		var _self = this,codeIndex = this.state.codeIndex,
			length = this.state.pageCodeArr.length;
		if (length == codeIndex+2) {
			this.showResult();
			this.setState({
				pageEnd: true,
			});
			clearInterval(this.interval);
		}
		this.setState({
			typed: this.state.typed + 1,
		});	
		document.onkeydown = function (e){
			if (_self.state.pageEnd) return;
			var keyNum = window.event?e.keyCode: e.which,
				pageCodeArr = _self.state.pageCodeArr,
				codeIndex = _self.state.codeIndex;
			if (keyNum == 13&&(pageCodeArr[codeIndex]["code"] == '\n')){
				pageCodeArr[codeIndex]["corrected"] = true;
				_self.setState({
					preValue: "",
					currentValue: '\n',
					codeIndex: codeIndex + 1,
					pageCodeArr: pageCodeArr,
				},function(){
					var Value = _self.state.pageCodeArr[_self.state.codeIndex]["code"];
					_self.skipT(Value,true);
				});
				
			}else if (keyNum == 8) {
				_self.setState({
					backspacing: _self.state.backspacing + 1,
				})
				pageCodeArr[codeIndex]["corrected"] = false;
				if (pageCodeArr[codeIndex]["erroring"]) {
					pageCodeArr[codeIndex]["back"] = true;
					pageCodeArr[codeIndex]["style"] = pageCodeArr[codeIndex]["style"].replace("incorrect","");
					pageCodeArr[codeIndex]["erroring"] = false;
					_self.setState({
						pageCodeArr: pageCodeArr,
						currentValue: pageCodeArr[codeIndex]["code"]
					})
				}else{
					_self.setState({
						codeIndex: codeIndex == 0 ? codeIndex : codeIndex - 1,
						pageCodeArr: pageCodeArr,
						currentValue: codeIndex == 0 ? pageCodeArr[codeIndex]["code"]:pageCodeArr[codeIndex - 1]["code"]
					})
				}
							
			}
			var nextValue = _self.state.pageCodeArr[_self.state.codeIndex]["code"];
			_self.skipT(nextValue,false);
		}
	},
	handleChange: function(event){
		this.bind();
		if (this.state.end) return;
		var pageCodeArr = this.state.pageCodeArr,
			codeIndex = this.state.codeIndex;
		if (!this.state.start) {
			this.setState({start: true});
			this.gameStart();
		}
		if (pageCodeArr[codeIndex]["errored"]) {
			if (pageCodeArr[codeIndex]["code"] == event.target.value) {
				pageCodeArr[codeIndex]["correcting"] = true;
				pageCodeArr[codeIndex]["corrected"] = true;
				pageCodeArr[codeIndex]["back"] = false;
			}
			this.setState({
				preValue: "",
				currentValue: event.target.value,
				codeIndex: this.state.codeIndex + 1,
				pageCodeArr: pageCodeArr
			});
			
		}else{
			if (pageCodeArr[codeIndex]["code"] == event.target.value){
				pageCodeArr[codeIndex]["corrected"] = true;
				this.setState({
					preValue: "",
					currentValue: event.target.value,
					codeIndex: this.state.codeIndex + 1,
					pageCodeArr: pageCodeArr
				});
			}else{
				var arr = this.state.pageCodeArr;
				arr[this.state.codeIndex]["errored"] = true;
				arr[this.state.codeIndex]["erroring"] = true;
				arr[this.state.codeIndex]["style"] += " incorrect";
				this.setState({
					pageCodeArr: arr
				})	
			}
				
		}
			
	},
	handleCheckedChange: function(e){
		alert(e);
	},
	AddCodeStyle: function(codeArr){
		var note = false,pageCodeArr = [];
		for (var i = 0; i < codeArr.length; i++) {
			pageCodeArr[i] = [];
			pageCodeArr[i]["code"] = codeArr[i];
			pageCodeArr[i]["errored"] = false;
			pageCodeArr[i]["erroring"] = false;
			pageCodeArr[i]["correcting"] = false;
			pageCodeArr[i]["corrected"] = false;
			pageCodeArr[i]["back"] = false;
			if (codeArr[i] == "/" && codeArr[i+1]=="/") note = true;
			else if(codeArr[i] == "\n"){
				note = false;
				pageCodeArr[i]["style"] = "return";
			}else{
				pageCodeArr[i]["style"] = "p";
			}
			if (note) pageCodeArr[i]["style"] = " note";
		}
		
		return pageCodeArr;
	},
	gameStart: function(){
		if (!this.state.start) this.setState({start: true});
		this.interval = setInterval(() => this.setTime(), 1000);
	},
	getTime: function(t){
		var minutes = parseInt((t % 3600) / 60);    // 计算分 
		var seconds = parseInt(t % 60);    // 计算秒  
		var time = "";
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		time = minutes + ":" + seconds;
		return time;
	},
	setTime: function(){
		this.setState((prevState) => ({
			timeIndex: prevState.timeIndex+1,
		}));
	},
	showResult: function(){
		this.setState({
			showResult: true,
		},()=>{
			$('.lesson').css({opacity: 0});
			$('.lesson').animate({opacity: 1},300);
			$('html,body').animate({scrollTop:$('.lesson').offset().top}, 1000);
		});
	},
	gameRestart: function(){

	},
	enlargeFont: function(){
		if (this.state.fontSize>21) {
			this.setState({
				fontMax: true,
			});
			return;
		}
		this.setState({
			fontSize: this.state.fontSize + 1,
			fontMin: false,
		},()=>{
			$("pre").css({
				fontSize: this.state.fontSize
			});
		})	
	},
	shrinkFont: function(){
		if (this.state.fontSize<15) {
			this.setState({
				fontMin: true,
			});
			return;
		}
		this.setState({
			fontSize: this.state.fontSize - 1,
			fontMax: false,
		},()=>{
			$("pre").css({
				fontSize: this.state.fontSize
			});
		})	
	},
	getTypeCode: function(){
		let pageCodeArr = this.state.pageCodeArr,sum=0;
		for (var i = 0; i < pageCodeArr.length; i++) {
			sum += pageCodeArr[i]["corrected"]?1:0;
		}
		return sum;
	},
	render: function(){
		var pageCodeArr = this.state.pageCodeArr, codeIndex = this.state.codeIndex,timeIndex = this.state.timeIndex,
			fontMax = this.state.fontMax,fontMin = this.state.fontMin;
		var i = -1,fontAlert = false;
		if (fontMax||fontMin) fontAlert = true;
		var speed = timeIndex==0?0:Math.floor((this.getTypeCode()/timeIndex)*60);
		var message = "";
		if (fontMax) message = "字体太大了，小一点吧";
		else if(fontMin) message = "字体太小了，大一点吧";
		var modal = <Modal title="提示">{message}</Modal>;
		return  (
			<div id="main-wrapper">
				<div className="main">
					<div className="mheader">
						<div className="tog-con">
							<div className="toggle">
								<input type="checkbox"onChange={this.enlargeFont}/>
								<span className="button"></span>
								<span className="label">+</span>
							</div>
							<div className="toggle" onChange={this.shrinkFont}>
								<input type="checkbox"/>
								<span className="button"></span>
								<span className="label">–</span>
							</div>
						</div>
						<div className="time">
							<span>时间 :</span>
							<span>{this.getTime(timeIndex)}</span>
							<span>速度 :</span>
							<span>{speed} 字/分</span>
							<span>开始/暂停</span><span className="" onClick={this.gameStart}><img src={this.state.start?"images/pause.svg":"images/play.svg"} alt=""/></span>
							<span>重新开始</span><span className="" onClick={this.gameRestart}><img src="images/spinner.svg" alt=""/></span>
						</div>
					</div>
					<pre>
						{	
							pageCodeArr.map(function(item){
								i++;
								return <span className={codeIndex == i? "char-active " + pageCodeArr[i]["style"]:pageCodeArr[i]["style"]} key={'re'+i}>{item["code"]}</span>
							})
						}
					</pre>
					<input type="text" value={this.state.preValue} onChange={this.handleChange} ref="nameInput" />
					<Result pageCodeArr={this.state.pageCodeArr} showResult={this.state.showResult} typed={this.state.typed} backspacing={this.state.backspacing} page={this.state.page} lineArr={this.state.lineArr} codeAllArr={this.state.codeAllArr} pageLine={this.state.pageLine} timeStr={this.getTime(this.state.timeIndex)} timeIndex={this.state.timeIndex} InvalidCode={this.state.InvalidCode}></Result>
					<div className="main-footer">
						<div className="pageing">
							<Button amStyle="danger" onClick={this.nextPage} className={this.state.showResult?"show":"hide"}>继续练习</Button>
						</div>
					</div>
					<ModalTrigger modal={modal} show={fontAlert}></ModalTrigger>
				</div>
				
				
			</div>
		)
	}
});

export default typing;