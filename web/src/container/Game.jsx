import React, { Component } from 'react';

class Game extends Component {

var Componentnt = React.createClass({

  render:function()
  {
    var Iframe=this.props.iframe;

    return(

      <div>

       <Iframe src={this.props.src} height={this.props.height} width={this.props.width}/>

      </div>
      )
  }
});
ReactDOM.render(
  <Componentnt iframe='iframe' src="http://plnkr.co/" height="500" width="500"/>,
  document.getElementById('example')
);
}
