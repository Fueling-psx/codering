import React, { Component } from 'react';
import {Grid,Col,Container,Panel,PanelGroup,Progress,Button,pageLine} from 'amazeui-react';


export default class SliderItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { pageCodeArr, showResult,typed,backspacing,codeAllArr,lineArr,page,pageLine,timeStr,timeIndex,InvalidCode} = this.props,result="",erroredNum = 0;
    if (!showResult) return null;


    let corRate = Math.floor((1-(typed - pageCodeArr.length + InvalidCode + 1)/(pageCodeArr.length - InvalidCode - 1))*100);
    let typeLine = 0;
    let speed = Math.floor(((pageCodeArr.length - 1)/timeIndex)*60);
    for (var i = 0; i < lineArr.length&&i<=page; i++) typeLine += lineArr[i];
    if (showResult) result = "Lesson Summery";
    else result = "Not finish";

    const title1 = (
        <h1>{result}</h1>
    );
    const title2 = (
        <h1>Lesson Progress</h1>
    );

    for (var i = 0; i < pageCodeArr.length - 1; i++) {
      if(pageCodeArr[i]['errored']) erroredNum++;
    }

    return (
      <div className="summery" >
        <Panel header={title1} className="lesson">
           <Grid className="doc-g">
              <Col sm={6}>本页字符:</Col>
              <Col sm={6}>{pageCodeArr.length - 1 -InvalidCode}</Col>
              <Col sm={6} className="typed">敲击字符:</Col>
              <Col sm={6}>
                <div className="ty">
                  {typed}
                </div>
                <div className="Intro">
                  <ul>
                    <li>{pageCodeArr.length - 1} typeable characters</li>
                    <li>+ <span className="incorrectCount">{erroredNum}</span>  incorrectly typed</li>
                    <li>+ <span className="collateralCount">{typed - erroredNum - backspacing - pageCodeArr.length + 1}</span> collaterally typed before backspacing</li>
                    <li>+ {backspacing}  backspaces</li>
                  </ul>
                </div>
              </Col>
              <Col sm={6} className="errored">正确率:</Col>
              <Col sm={6}>
                <div className="ety">
                    {corRate?corRate: 0}%
                </div>
                <div className="Intro">
                  <div className="numerator">{typed} typed — {pageCodeArr.length - 1 -InvalidCode} typeable</div>
                  <div className="denominator">{pageCodeArr.length - 1} typeable</div>
                </div>
              </Col>
              <Col sm={6}>所花时间:</Col>
              <Col sm={6}>{timeStr}</Col>  
              <Col sm={6}>速度:</Col>
              <Col sm={6}>{speed} 字/分</Col>
            </Grid>
        </Panel>
        <Panel header={title2} className="progress">
            <ul>
              <li>{page*pageLine}  lines typed</li>
              <li>{codeAllArr.length - page*pageLine} lines remaining</li>
            </ul>
            <Progress amStyle="warning" now={page*pageLine/codeAllArr.length*100} />
        </Panel>
      </div>
    );
  }
}