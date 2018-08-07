import React, { Component } from 'react';
import GameApi from './api';
// import $ from 'jquery';
// import Modal from 'react-bootstrap-modal'

class Popup extends Component {
	
	getBody() {
		switch (this.props.page) {
			case 1: // start screen
				return (
					<div>
						<h2>Welcome to Harvey's Hundreds!</h2>
					</div>
				);
			case 2: // add score
				return (
					<div>
						<form>
						  <div class="form-group">
						    <label for="exampleInputEmail1">Email address</label>
						    <input type="text" class="form-control" id="input_username" aria-describedby="usernameHelp" placeholder="Enter a username for this high score." />
						    <small id="emailHelp" class="form-text text-muted">No more than 15 characters in a username</small>
						  </div>
						  <button type="submit" class="btn btn-primary">Submit</button>
						</form>
					</div>
				);
			default: // highscores
				return (
				<div>
					<ul class="list-group">
					  <li class="list-group-item">Cras justo odio</li>
					  <li class="list-group-item">Dapibus ac facilisis in</li>
					  <li class="list-group-item">Morbi leo risus</li>
					  <li class="list-group-item">Porta ac consectetur ac</li>
					  <li class="list-group-item">Vestibulum at eros</li>
					</ul>
				</div>
				);
		}
	}
	
	getTitle() {
		switch (this.props.page) {
		case 1: // start screen
			return (
				<h1 className='modal-title' id='pop-title'>Harvey Hundreds</h1>
			);
		case 2: // add score
			return (
				<h1 className='modal-title' id='pop-title'>New High Score!</h1>
			);
		default: // highscores
			return (
			<h1 className='modal-title' id='pop-title'>High Scores</h1>
			);
		}
	}
	
	getFooter() {
		switch (this.props.page) {
		case 1: // start screen
			return (
				<div className='footer'>
		        	<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.props.toStart}>Start Game</button>
		        	<button type="button" className="btn btn-secondary">How To Play</button>
		        	<button type="button" className="btn btn-secondary">High Scores</button>
				</div>
			);
		case 2: // add score
			return (
				<div className='footer'>
		        	<button type="button" className="btn btn-secondary">Cancel</button>
				</div>
			);
		default: // highscores
			return (
				<div className='modal-footer'>
		        	<button type="button" className="btn primary">Back</button>
				</div>
			);
		}
	}
	
	render() {
		let modal_classes = ['modal', 'fade', 'popup'].join(' ');
		let modal_dialog_classes = ['modal-dialog', 'modal-dialog-centered', 'modal-lg'].join(' ');
		let body = null;
		let title = null;
		let footer = null;
		
		return (
			<div className={modal_classes} id='pop' role='dialog' tabIndex='-1' data-show>
				<div className={modal_dialog_classes} role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							{this.getTitle()}
						</div>
						<div className='modal-body'>
							{this.getBody()}
						</div>
						<div className='modal-footer'>
				        	{this.getFooter()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class Card extends Component {
  render() {
	if (!this.props.inPlay) {
		const img_url = "images/cash.jpg";
		return (
				<button className="card" style={{backgroundImage: `url(${img_url})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat'}}></button>	
		);
	}
	else {
		if (this.props.flip) {
			const img_url = this.props.img;
		    return (
		    	<button className="card" onClick={this.props.onClick} style={{backgroundImage: `url(${img_url})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat'}}></button>
		    );
		}
		else {
			return (
				<button className="card" onClick={this.props.onClick}>
				{this.props.value}
				</button>
			);
		}
	}
  }
}

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
    this.getImageForCardID = this.getImageForCardID.bind(this);
    this.isMatch = this.isMatch.bind(this);
    this.canClickAll = this.canClickAll.bind(this);
  }

  /**
   * Return an object representing the initial game state
   */
  initGameState() {
    return {
      showModal: true,
      modalVisible: true,
      modalPage: 1,
      matches: 0,
      timeLeft: 60.0,
      startTime: null,
      gameRunning: false,
      cardFlips: 0,
      cardSelected: null,
      pairs: this.makePairs(),
      cards: [
        {id: 1, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 2, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 3, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 4, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 5, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 6, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 7, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 8, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 9, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 10, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 11, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 12, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 13, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 14, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 15, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 16, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 17, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 18, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 19, flipped: false, inPlay: true, canClick: true, clicks: 0},
        {id: 20, flipped: false, inPlay: true, canClick: true, clicks: 0}
      ]
    };
  }

  /**
   * Returns a score representing the user's playing efficiency 
   */
  calculateEfficiency() {
    const matches = this.state.matches;
    const flips = this.state.cardFlips % 2 === 0 ? this.state.cardFlips : this.state.cardFlips - 1; //only an even number of card flips can count as a valid set of attempts.

    const standard_efficiency = matches === 0 ? 0 : (2*matches) + 1;
    const user_efficiency = (2*matches) > flips ? (2*matches) + 1 : flips + 1;
    return standard_efficiency/user_efficiency;
  }

  /**
   * Create and return random pairs of cards, each pair assigned a random image
   */
  makePairs() {
    var arr = Array.from({length: 20}, (v, k) => k+1); //card ids
    var arr2 = Array.from({length: 60}, (v, k) => k+1); //image ids
    var ret = [];
    
    //returns a random number between 0 and max, excluding ex
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
    //return two distinct random numbers greater than 0 and less than len
    var randoms = (len) => {
      var r1 = rInt(len, -1); 
      var r2 = rInt(len, r1);
      return {r1: r1, r2: r2};
    };

    //copy array, excluding ex1 and ex2 values
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

    //create random pairs of ids with random
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
  
  /**
   * Get the relative url of the image assigned to this card id
   */
  getImageForCardID(id) {
	  var i;
	  for (i = 0; i < this.state.pairs.length; i++) {
		  if (this.state.pairs[i].id1 === id || this.state.pairs[i].id2 === id) {
			  return this.state.pairs[i].img;
		  }
	  }
	  return null;
  }
  
  /**
   * Returns true if card with id1 and card with id2 are a pair
   */
  isMatch(id1, id2) {
	  var ret = false;
	  var i = 0;
	  for (i = 0; i < this.state.pairs.length; i++) {
		  if (this.state.pairs[i].id1 === id1 && this.state.pairs[i].id2 === id2) {
			  ret = true;
			  break;
		  }
		  else if (this.state.pairs[i].id1 === id2 && this.state.pairs[i].id2 === id1) {
			  ret = true;
			  break;
		  }
	  }
	  return ret;
  }
  
  

  /**
   * Sets all cards' "canClick" attribute to either true or false
   */
  canClickAll(b) {
	  let cards = this.state.cards;
	  let i;
	  for (i = 0; i < cards.length; i++) {
		  cards[i].canClick = b;
	  }
	  this.setState({
		 cards: cards 
	  });
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

  /**
   * Render a Card with the given props
   */
  renderCard(id) {
    return (
      <Card onClick={() => this.handleClick(id)} value={id} flip={this.state.cards[id-1].flipped} img={this.getImageForCardID(id)} inPlay={this.state.cards[id-1].inPlay} />
    );
  }

  /**
   * Handle clicks on cards
   */
  handleClick(id) {
	 //only handle click if the card/game is in a state to accept a click 
	 if (this.state.gameRunning && this.state.cards[id-1].inPlay && this.state.cards[id-1].canClick) {
		 let cards = this.state.cards;
	     cards[id-1].flipped = true;
	     
	     //there is no card selected currently
	     if (!this.state.cardSelected) {
	       cards[id-1].canClick = false;
	       this.setState((prevState, props) => ({
	         cardSelected: prevState.cards[id-1],
	         cardFlips: prevState.cardFlips + 1,
	         cards: cards
	       }));
	     }
	     //there is already a card selected
	     else {
	    	//set flipped state for this card
	    	this.setState((prevState, props) => ({
	    		cards: cards,
	    		cardFlips: prevState.cardFlips + 1
	    	}));
	    	//prevent clicks and pause for a moment
	    	this.canClickAll(false);
	    	let context = this;
	    	setTimeout(function() {
	    		const id1 = context.state.cardSelected.id;
	        	const id2 = id;
	        	const match = context.isMatch(id1, id2);
	        	//check if clicked card matches previously clicked card, remove the cards from play
	        	if (match) {
	        		cards[id1-1].inPlay = false;
	        		cards[id2-1].inPlay = false;
	        	}
	        	//if no match, just flip the cards back.
	        	else {
	        		cards[id1-1].flipped = false;
	        		cards[id2-1].flipped = false;
	        	}
	        	//set state and enable clicks, or end game if there are no more matches
	        	let keepGoing = function () {
	        		//if time is up, just end the game
	        		if (context.state.timeLeft === 0.0) {
	        			return false;
	        		}
	        		var i;
	        		for (i = 0; i < context.state.cards.length; i++) {
	        			if (context.state.cards[i].inPlay === true) {
	        				return true;
	        			}
	        		}
	        		//there are no pairs left in play, end the game.
	        	    clearInterval(context.clock);
	        		return false;
	        	}
	        	
	        	context.setState((prevState, props) => ({
	        		gameRunning: keepGoing() ? true : false,
        			matches: match ? prevState.matches + 1 : prevState.matches,
	        		cards: cards,
        			cardSelected: null
        		}));
	        	context.canClickAll(true);
	    	}, 850);
	     }
	 }
  }

  /**
   * Return a string representation of how much the player has "earned" so far
   */
  moneyAmount() {
    if (this.state.matches === 0) {
      return "$0";
    }
    else {
      return "$"+(this.state.matches*100);
    }
  }

  /**
   * Decrement function for the in-game timer
   */
  timeDecrement() {
	let nd = new Date();
    let tp = (nd - this.state.startTime) / 1000;
    let tl = (60.0 - tp) >= 0.1 ? 60.0 - tp : 0.0;
	this.setState({
		timeLeft: tl,
	    gameRunning: tl > 0.0
	});
	if (tl === 0.0) clearInterval(this.clock);

  }

  /**
   * Start a game, assuming the game state is equal to the initial game state
   */
  startGame() {
    if (!this.state.gameRunning) {
      this.setState({
        gameRunning: true,
        showModal: false, 
        startTime: new Date()
      });
      this.clock = setInterval(this.timeDecrement, 100);
    }
  }

  showModal(page){
	  	this.setState({
	  		showModal: true,
	  		modalPage: page
	  	});
	  	var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: false,
			view: window
		});
		// If cancelled, don't dispatch our event
		let elem = document.getElementById('modal_trigger')
		elem.dispatchEvent(evt);
  }
  
  componentDidUpdate(prevProps) {
	  // Typical usage (don't forget to compare props):
	  console.log("***** componentDidUpdate *****");
	  console.log("Show Modal: "+ this.state.showModal);
	  console.log("Modal Visible: "+ this.state.modalVisible);
	  if (this.state.showModal && !this.state.modalVisible) {
		  var evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: false,
				view: window
			});
			// If cancelled, don't dispatch our event
			let elem = document.getElementById('modal_trigger');
			elem.dispatchEvent(evt);
	  }
  }
  
  render() {
	  let cardClasses = ['c_container','col-3'].join(' ')
      return (
        <div className="game_container">
        	<Popup toStart={() => this.startGame()} page={this.state.modalPage}/>
            <div className="info_container">
              <p>Card Flips: {this.state.cardFlips}</p>
              <p>Money Earned: {this.moneyAmount()}</p>
              <p>Time Left (s): {parseFloat(Math.round((this.state.timeLeft)*100) / 100).toFixed(1)}</p>
            </div>
            <div className="card_container">
	            <div className="container">
	              <div className="row">
	                <div className={cardClasses}>{this.renderCard(1)}</div>
	                <div className={cardClasses}>{this.renderCard(2)}</div>            
	                <div className={cardClasses}>{this.renderCard(3)}</div>   
	                <div className={cardClasses}>{this.renderCard(4)}</div>                    
	              </div>
	              <div className="row">
	              	<div className={cardClasses}>{this.renderCard(5)}</div> 
	                <div className={cardClasses}>{this.renderCard(6)}</div>
	                <div className={cardClasses}>{this.renderCard(7)}</div>            
	                <div className={cardClasses}>{this.renderCard(8)}</div>     
	              </div>
	              <div className="row">
	              	<div className={cardClasses}>{this.renderCard(9)}</div>            
	              	<div className={cardClasses}>{this.renderCard(10)}</div>
	                <div className={cardClasses}>{this.renderCard(11)}</div>
	                <div className={cardClasses}>{this.renderCard(12)}</div>            
	              </div>
	              <div className="row">
	              	<div className={cardClasses}>{this.renderCard(13)}</div>   
	              	<div className={cardClasses}>{this.renderCard(14)}</div>            
	              	<div className={cardClasses}>{this.renderCard(15)}</div>  
	                <div className={cardClasses}>{this.renderCard(16)}</div>
	              </div>
	              <div className="row">
		            <div className={cardClasses}>{this.renderCard(17)}</div>            
		            <div className={cardClasses}>{this.renderCard(18)}</div>   
		            <div className={cardClasses}>{this.renderCard(19)}</div>
		            <div className={cardClasses}>{this.renderCard(20)}</div>
	              </div>
	            </div>
            </div>
            <button type="button" id="modal_trigger" data-toggle="modal" data-backdrop="static" data-target="#pop">pop</button>
          </div>
      );
  }
}

export default App;
