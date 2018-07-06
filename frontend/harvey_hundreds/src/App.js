import React, { Component } from 'react';
import GameApi from './api'

/** 
 * Class that renders all informational popups in the game.
*/
class Popup extends Component {
  render() {
    return (
      <div className="modal" role={this.props.role}>
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
    this.clock = null;

    this.startGame = this.startGame.bind(this);
    this.timeDecrement = this.timeDecrement.bind(this);
    this.moneyAmount = this.moneyAmount.bind(this);
    this.calculateEfficiency = this.calculateEfficiency.bind(this);
  }

  initGameState() {
    return {
      matches: 0,
      timeLeft: 60.0,
      gameRunning: false,

      cardFlips: 0,
      cardSelected: null,
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

  calculateEfficiency() {
    const matches = this.state.matches;
    const flips = this.state.cardFlips % 2 === 0 ? this.state.cardFlips : this.state.cardFlips - 1; //only an even number of card flips can count as a valid set of attempts.

    const standard_efficiency = matches == 0 ? 0 : (2*matches) + 1;
    const user_efficiency = (2*matches) > flips ? (2*matches) + 1 : flips + 1;
    return standard_efficiency/user_efficiency;
  }

  /**
   * Initialize matching pairs of cards
   */
  makePairs() {
    var arr = Array.from({length: 20}, (v, k) => k+1); //card ids
    var arr2 = Array.from({length: 60}, (v, k) => k+1); //image ids
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
      var imgIndex = rInt(arr2.length, -1);
      pair.img = "images/" + arr2[imgIndex] + ".jpg";
      ret.push(pair);
      arr = arrCpy(arr, pair.id1, pair.id2);
      arr2 = arrCpy(arr2, arr2[imgIndex], -1);
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
     if (this.state.cardSelected === null) {
       let cardz = this.state.cards;
       cardz[id-1].flipped = true;
       this.setState({
         cardSelected: this.state.cards[id-1],
         cards: cardz
       });
     }
  }

  moneyAmount() {
    if (this.state.matches === 0) {
      return "$0";
    }
    else {
      return "$"+(this.state.matches*100);
    }
  }

  timeDecrement() {
    const running = this.state.gameRunning;
    const time = this.state.timeLeft;
    if (running) {
      this.setState({
        timeLeft: this.state.timeLeft - 0.1
      });
    }
    if (time < 0.1) {
      this.setState({
        timeLeft: 0,
        gameRunning: false
      });
      clearInterval(this.clock);
    }
  }

  startGame() {
    if (!this.state.gameRunning) {
      this.setState({
        gameRunning: true
      });
      this.clock = setInterval(this.timeDecrement, 100);
    }
  }

  render() {
      return (
        <div className="game_container">
            <div className="info_container">
              <p>{this.moneyAmount()}</p>
              <p>{parseFloat(Math.round((this.state.timeLeft)*100) / 100).toFixed(1)}</p>
            </div>
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
            <button id="start" onClick={() => this.startGame()}>
              {this.state.gameRunning ? "GAME RUNNING" : "GAME STOPPED"}
            </button> 
          </div>
      );
  }
}

export default App;
