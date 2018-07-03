import React, { Component } from 'react';
import './App.css';
import GameApi from './api'

/** 
 * Class that renders all informational popups in the game.
*/
class Popup extends Component {
  render() {
    return (
      <div className="modal fade" role={this.props.role}>
        {this.props.renderContent()}
      </div>
    );
  }
}

/** 
 * Class that represents a single card that can be flipped and matched with other cards.
*/
class Card extends Component {
  render() {
    return (
      <button className="card" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

/** 
 * All game logic 
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.gameApi = new GameApi();
    this.state = this.initGameState();
  }

  initGameState() {
    return {
      matches: 0,
      timeLeft: 60.0,
      cardFlips: 0,
      oneCardFlipped: false,
      pairs: this.makePairs(),
      cards: [
        {id: 1, flipped: false, inPlay: true},
        {id: 2, flipped: false, inPlay: true},
        {id: 3, flipped: false, inPlay: true},
        {id: 4, flipped: false, inPlay: true},
        {id: 5, flipped: false, inPlay: true},
        {id: 6, flipped: false, inPlay: true},
        {id: 7, flipped: false, inPlay: true},
        {id: 8, flipped: false, inPlay: true},
        {id: 9, flipped: false, inPlay: true},
        {id: 10, flipped: false, inPlay: true},
        {id: 11, flipped: false, inPlay: true},
        {id: 12, flipped: false, inPlay: true},
        {id: 13, flipped: false, inPlay: true},
        {id: 14, flipped: false, inPlay: true},
        {id: 15, flipped: false, inPlay: true},
        {id: 16, flipped: false, inPlay: true},
        {id: 17, flipped: false, inPlay: true},
        {id: 18, flipped: false, inPlay: true},
        {id: 19, flipped: false, inPlay: true},
        {id: 20, flipped: false, inPlay: true}
      ]
    };
  }

  /**
   * Initialize matching pairs of cards
   */
  makePairs() {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var ret = [];
    
    var rInt = (max, ex) => {
      if (ex === -1) return Math.floor(Math.random() * Math.floor(max));
      else {
        var ret = Math.floor(Math.random() * Math.floor(max));
        while(ret === ex) {
          ret = Math.floor(Math.random() * Math.floor(max));
        }
        return ret;
      }
    };
    var randoms = (len) => {
      var r1 = rInt(len, -1); 
      var r2 = rInt(len, r1);
      return {r1: r1, r2: r2};
    };

    var arrCpy = (ar, ex1, ex2) => {
      var ret = [];
      var i;
      for (i = 0; i < ar.length; i++) {
        if (ar[i] !== ex1 && ar[i] !== ex2) {
          ret.push(ar[i]);
        }
      }
      return ret;
    };

    while (arr.length > 0) {
      let inds = randoms(arr.length);
      var pair = {id1: arr[inds.r1], id2: arr[inds.r2]};
      ret.push(pair);
      arr = arrCpy(arr, pair.id1, pair.id2);
    }
    console.log(ret);
    return ret;
  }

  handleLastScore (r) {
    
  }

  handleFirstScore (r) {

  }

  handleAddScore (r) {

  }

  handleAllScores (r)  {

  }

  compareScores(s1, s2) {

  }

  handleApiError () {}

  renderCard(id) {
    return (
      <Card onClick={() => this.handleClick(id)} value={id}/>
    );
  }
  handleClick(id) {
     alert("Clicked "+id+"!");
  }

  render() {
    return (
        <div className="cards_container">
          <div className="card_row">
            <div className="card_container">{this.renderCard(1)}</div>
            <div className="card_container">{this.renderCard(2)}</div>            
            <div className="card_container">{this.renderCard(3)}</div>   
            <div className="card_container">{this.renderCard(4)}</div>            
            <div className="card_container">{this.renderCard(5)}</div>         
          </div>
          <div className="card_row">
            <div className="card_container">{this.renderCard(6)}</div>
            <div className="card_container">{this.renderCard(7)}</div>            
            <div className="card_container">{this.renderCard(8)}</div>   
            <div className="card_container">{this.renderCard(9)}</div>            
            <div className="card_container">{this.renderCard(10)}</div>  
          </div>
          <div className="card_row">
            <div className="card_container">{this.renderCard(11)}</div>
            <div className="card_container">{this.renderCard(12)}</div>            
            <div className="card_container">{this.renderCard(13)}</div>   
            <div className="card_container">{this.renderCard(14)}</div>            
            <div className="card_container">{this.renderCard(15)}</div>  
          </div>
          <div className="card_row">
            <div className="card_container">{this.renderCard(16)}</div>
            <div className="card_container">{this.renderCard(17)}</div>            
            <div className="card_container">{this.renderCard(18)}</div>   
            <div className="card_container">{this.renderCard(19)}</div>            
            <div className="card_container">{this.renderCard(20)}</div>  
          </div>
        </div>
    );
  }
}

export default App;
