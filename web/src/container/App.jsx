import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
        React.cloneElement(this.props.children)
    );
  }
}

export default App;
