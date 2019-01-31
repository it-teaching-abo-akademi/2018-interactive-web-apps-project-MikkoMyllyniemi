import React, { Component } from 'react';
import './App.css';
import Portfolio from "./Portfolio";

class App extends Component {
  constructor () {
    super();

    this.state = {
      portfolios: [],
        search: ""
    };

  }

  onInputChange = e => {
    this.setState({
      search: e.target.value
    });
  }

  onClick = () => {
    if(this.state.portfolios.length !== 10){
      let portfoliocopy = this.state.portfolios.slice();
      if(this.state.search !== "") {
          portfoliocopy.push(this.state.search);
      }else{portfoliocopy.push("Portfolio");}
      this.setState({
        portfolios: portfoliocopy,
          search: ""
      });
    }else{
      alert("Portfolio amount can't exceed 10")
    }

  }

  deletePortfolio = i => {
    let portfolioscopy = this.state.portfolios.slice();
    portfolioscopy.splice(i, 1);
    
    this.setState({portfolios: portfolioscopy});
  }

  render() {
    let showportfolios = this.state.portfolios.map((e,i) => {
       return (
           <Portfolio key={i} name={e} delete={() => this.deletePortfolio(i)}/>
       );

      });


    return (
      <div className="App">
        <input default={"Portfolio"} placeholder={"Portfolio name"} value={this.state.search} onChange={this.onInputChange}/>
        <button onClick={this.onClick}>Add portfolio</button><br/>
        {this.state.portfolios.length === 0 ? "" : showportfolios}
      </div>
    );
  }
}

export default App;
