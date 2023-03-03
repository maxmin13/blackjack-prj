/*jshint esversion: 6 */

import {Utils} from '../common/utils.js';
import {Play} from '../common/play.js';
import {Player} from '../common/player.js';
import {Dealer} from './dealer.js';
import {Deck} from './deck.js';
import {PlayStatus} from '../common/playstatus.js';
import {GamblerStatus} from '../common/gamblerstatus.js';

export class Server {

	constructor() {
		this.deck = new Deck();
		this._dealer = new Dealer('hat');
		this._players = []; // array of Player objects.
		this.play = null;
		this.dealerHiddenCard = null;
	}

	addPlayer(player) {
		this._players.push(player);
	}
	
	startPlay() {
		if (this.play !== null && this.play.status !== PlayStatus.END) {
			Utils.debug('SERVER: Play already started.');
			return this.play;
		}
		if (this._players.length == 0) {
			Utils.debug('SERVER: No players at the table.');
			return this.play;
		}
		
		// check if the shoe has enough cards left.
		this.deck.checkDeck();
		
		this._dealer.reset();
		this.dealerHiddenCard = null;
		
		// Sort the players by seat.
		Player.sortPlayers(this._players);
		
		for (var i = 0; i < this._players.length; i++) {
			this._players[i].reset();
		}
		
		this.play = new Play(this._players, this._dealer);
		
		Utils.debug('SERVER: Starting play ...');

		this.play.status = PlayStatus.DEALING;
				
		// Two rounds of cards to the dealer and the players.
		for(var j = 0; j < 2; j++) {
			// Draw a card for each player.
			var card = null;
			for (var i = this.play.players.length -1; i >= 0; i--) {	
				card = this.deck.drawCard();
				var player = this.play.players[i];
				player.addCard(card);
			}
			
			// Draw a card for the dealer.
			card = this.deck.drawCard();
			if (j !== 0) {
				this.play.dealer.addCard(card);
			}
			else {
				// do not disclose the first card.
				this.dealerHiddenCard = card;
				this.play.dealer.addCard(Deck.BackCard);		
			}
		}
		
		Utils.debug('SERVER: Play started.');
		Utils.debug('SERVER: The players can draw a card.');
		
		this.play.status = PlayStatus.HITTING;
		
		Utils.debug(this.play);
			
		return this.play;
	}
	
	// Draw a card for a player.
	hitPlayer(player) {
		if (this.play.status === PlayStatus.HITTING) {	
			var p = this.__getPlayerAtSeat(player.clientId, player.userId, player.seat);
			if (p !== null && p.status === GamblerStatus.PLAYING) {	
				Utils.debug('SERVER: Player ' + p.userId + ' at seat ' + p.seat.position +  ' wants a card.');
				var card = this.deck.drawCard();
				p.addCard(card);
			}
			return p;		
		}
		else {
			Utils.debug('SERVER: Hitting not allowed at the moment!');
		}	
	}
	
	// The player doesn't need more cards.
	stickPlayer(player) {	
		if (this.play.status === PlayStatus.HITTING) {	
			var p = this.__getPlayerAtSeat(player.clientId, player.userId, player.seat);
			if (p !== null && p.status === GamblerStatus.PLAYING) {	
				Utils.debug('SERVER: Player ' + p.userId + ' at seat ' + p.seat.position +  ' wants to stick.');
				p.status = GamblerStatus.STICK;
			}
			return p;		
		}
		else {
			Utils.debug('SERVER: Sticking not allowed at the moment!');
		}
	}
	
	finalizePlay() {
		if (this.play.status === PlayStatus.HITTING) {	
			this.play.status = PlayStatus.FINALIZING;
			Utils.debug('SERVER: Finalizing play ...');
			this.play.dealer.replaceCardAt(0, this.dealerHiddenCard);	
			this.__finalizePlayAtDealerSecondCard(this.play);
			do {
				// draw a card for the dealer.
				var card = this.deck.drawCard();
				this.play.dealer.addCard(card);
				this.__finalizePlay(this.play, this.deck);
			}
			while (this.play.status !== PlayStatus.END);
			
			Utils.debug('SERVER: The play is ended.');
			this.__getWinners();
		}
		else {
			Utils.debug('SERVER: play already finalized!');
		}
	}
	
	// sets the status of the players to winner or looser.
	__getWinners() {
		Utils.debug('SERVER: Getting winners ...');
		var players = this.play.players;
		for(var i = 0; i < players.length; i++) {
			var player = players[i];
			if (player.status === GamblerStatus.BURST) {
				player.status = GamblerStatus.LOOSER;
			}
			else if (player.status === GamblerStatus.BJ) {
				Utils.debug('SERVER: Player ' + player.userId + ' at seat ' + player.seat.position +  ' is a winner.');
				player.status = GamblerStatus.WINNER;
			}
			else {
				var dealer = this.play.dealer;
				if (dealer.status === GamblerStatus.BJ) {
					player.status = GamblerStatus.LOOSER;
				}
				else if (dealer.status === GamblerStatus.BURST) {
					Utils.debug('SERVER: Player ' + player.userId + ' at seat ' + player.seat.position +  ' is a winner.');
					player.status = GamblerStatus.WINNER;
				}
				else {
					var dealerScore = dealer.hand.getScore();
					var playerScore = player.hand.getScore();
					if (playerScore >= dealerScore) {
						Utils.debug('SERVER: Player ' + player.userId + ' at seat ' + player.seat.position +  ' is a winner.');
						player.status = GamblerStatus.WINNER;						
					}
					else {
						player.status = GamblerStatus.LOOSER;
					}
				}
			}				
		}
	}
	
	// AFTER THE DEALER'S THIRD CARD:
	// case: dealer result > 16 ==> end play.
	// case: dealer result <= 16, at least one player has BJ and all the others burst ==> end play.
	__finalizePlay(play, deck) {
		if (play.status === PlayStatus.FINALIZING) {
			var playersStatus = Player.getPlayersStatus(play.players); 
			var dealerTotal = play.dealer.hand.getScore();
		
			if (play.dealer.status === GamblerStatus.BURST || play.dealer.status === GamblerStatus.BJ) {
				//end play
				play.status = PlayStatus.END;
				return;
			}
			else if (dealerTotal > 16) {
				//end play
				play.status = PlayStatus.END;
				return;
			}
			else if (dealerTotal <= 16) {
				if (playersStatus.get(GamblerStatus.BJ) > 0 && 
						playersStatus.get(GamblerStatus.PLAYING) === 0) { // at least one player has BJ and all the others burst
					//end play
					play.status = PlayStatus.END;
					return;	
				}
			}
		}
		else {
			Utils.debug('SERVER: Play not in RESULT status.');
		}
	}

	// AFTER THE DEALER'S SECOND CARD:	
	// case: all players burst ==> end play.	
	// case: at least one player has BJ and all the others burst, dealer result < 10 ==> end play.	
	// case: all players have BJ, dealer result < 10 ==> end play.		
	__finalizePlayAtDealerSecondCard(play) {
		if (play.status === PlayStatus.FINALIZING) {
			var dealerTotal = play.dealer.hand.getScore();
			var playersStatus = Player.getPlayersStatus(play.players);
			
			if (playersStatus.get(GamblerStatus.BURST) === play.players.length) { // all players burst.
				//end play
				play.status = PlayStatus.END;
				return;
			}
			else if (playersStatus.get(GamblerStatus.BJ) === play.players.length) { // all players have bj.
				if (dealerTotal < 10) {
					//end play
					play.status = PlayStatus.END;
					return;
				}
			}
			// at least one player has BJ and all the others burst
			else if (playersStatus.get(GamblerStatus.BJ) > 0 && playersStatus.get(GamblerStatus.PLAYING) === 0) { 
				if (dealerTotal < 10) {
					//end play
					play.status = PlayStatus.END;
					return;
				}
			}		
		}
		else {
			Utils.debug('SERVER: Play not in RESULT status.');
		}
	}
			
	// Get a player in a specific seat. 
	__getPlayerAtSeat(clientId, userId, seat) {
		for(var i = 0; i < this.play.players.length; i++) {
			var player = this.play.players[i];
			if (player.clientId === clientId && player.userId === userId && player.seat === seat) {
				return player;
			}
		}
		return null;
	}
}

