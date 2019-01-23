import React, { Component } from 'react';
import DataContainer from '../../containers/DataContainer';

class Dashboard extends Component {

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
	          <DataContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard