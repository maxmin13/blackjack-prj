/*jshint esversion: 6 */

import {Seat} from '../common/seat.js';
import {Card} from '../common/card.js';
import {Position} from '../common/position.js';
import {Utils} from '../common/utils.js';
import {Player} from '../common/player.js';
import {PlayStatus} from '../common/playstatus.js';
import {GamblerStatus} from '../common/gamblerstatus.js';
import {ClientConstants} from './clientconstants.js';
	
export class Table {

	constructor() {
		this.seatOne = new Seat(1);
		this.seatTwo = new Seat(2);
		this.seatThree = new Seat(3);
		this.seatFour = new Seat(4);
		this.seatFive = new Seat(5);
		this.seatSix = new Seat(6);
		this.seatSeven = new Seat(7);	
	}
						
	static async displayPlayCards(play) {
		var players = play.players;
		var dealer = play.dealer;
		var card = null;
		var counter = 0, delay = 0;	
		if (play.status === PlayStatus.END) {
			card = dealer.hand.cards[0];
			Table.__displayDealerFirstCard(card);
			card.dealt = true;
		}
		var moreCards = false;
		var promise = null;
		
		do {
			if (promise != null) {
				await promise;
			}

			moreCards = false;	
			// the players.
			for (var i = players.length -1; i >= 0; i--) {	
				var player = players[i];
				if (player.hasCardsToDeal()) {
					delay = ++counter * ClientConstants.CardsShuffleTime;	
					promise = Table.__displayPlayerCard(player, delay);
					moreCards = true;
				}				
			}
			// the dealer.
			if (dealer.hasCardsToDeal()) {
				delay = ++counter * ClientConstants.CardsShuffleTime;	
				promise = Table.__displayDealerCard(dealer, delay);
				moreCards = true;
			}
		}
		while(moreCards);
		
		return promise; // return the last promise, all the others have resolved.
	}
	
	static __displayPlayerCard(player, delay) { 
	
		var $shoe = $('div#shoe');
		var shoePosition = $shoe.offset(); 
		
		// get the position to which to slide the card.
		var $seat  = $('div#seat' + player.seat.position);
		var seatPosition = $seat.offset();
		
		var dLeft = seatPosition.left - shoePosition.left -14; 
		var dTop =  seatPosition.top - shoePosition.top -14;

		var cards = player.hand.cards;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i]; 
			if(card.dealt == false) { // get the first non dealt card.	
				var $card = Table.__buildCardElement(card, player.userId + player.seat.position);
				$card.attr('style', 'position: absolute; left: 20px; top: 20px;');
				$card.appendTo($shoe);
				// slide the card from the shoe and append it to the seat.
				var args = [$card, $seat, i];
				card.dealt = true;
				return Table.__slideCardTo($card, dLeft, dTop, delay)
					.then(function() {
						Table.__appendCardToSeat($card, $seat, i);
					})
					.catch((error) => Utils.error(error));
				break;
			}
		}
	}
			
	static __displayDealerCard(dealer, delay) {
		var $shoe = $('div#shoe');
		var shoePosition = $shoe.offset(); 
		
		// get the position to which to slide the card.
		var $dealer = $('div#dealer');
		var dealerPosition = $dealer.offset();
		var dLeft = dealerPosition.left + $dealer.width()/2 - shoePosition.left; 
		var dTop =  dealerPosition.top - shoePosition.top - 50;
	
		var cards = dealer.hand.cards;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i]; 
			if(card.dealt == false) { // get the first non dealt card.	
				var $card = Table.__buildCardElement(card, dealer.userId);
				$card.attr('style', 'position: absolute; left: 20px; top: 20px;');
				$card.appendTo($shoe);	
				// slide the card from the shoe and append it to the dealer div.
				var args = [$card];
				card.dealt = true;
				return Table.__slideCardTo($card, dLeft, dTop, delay)
					.then(function() {
						Table.__appendCardToDealer($card);
					})
					.catch((error) => Utils.error(error));
				break;						
			}
		}	
	}
		
	// moves the card from the shoe to the seat or to the dealer.
	// returns a Promise that resolves after the sliding animation has completed.
	static async __slideCardTo($card, dLeft, dTop, delay) {
		await new Promise(done => setTimeout(() => done(), delay));
		$card.removeClass('invisible').addClass('visible');
		await new Promise(done => setTimeout(() => done(), ClientConstants.CardsShoeTime));
		$card.animate({left: '+='+dLeft, top: '+='+dTop}, ClientConstants.CardsSlideTime); 
		return $card.promise();		
	}
	
	static __appendCardToDealer($card) {
		var $dealer = $('div#dealer');
		$card.attr('style', '');
		$card.appendTo($dealer);
	}
	
	static __appendCardToSeat($card, $seat, delta) {
		var seatPosition = new Position(7, 7 + delta * 25); // each card is appended above the previous one, a 'delta' lower.
		$card.attr('style', 'position: absolute; left: ' + seatPosition.left + 'px; top: ' + seatPosition.top + 'px;');
		$card.appendTo($seat);
	}
		
	static __displayDealerFirstCard(card) {
		$('div#dealer > img[alt="back card"]').attr('src', 'images/blackjack/cards/' + card.suit + '/' + card.name + '.jpg');
	}
		
	static clearTable() {
		$('div#shoe > img[class*="card"]').remove();
		$('div#dealer > img[class*="card"]').remove();
		$('div#seat1 > img[class*="card"]').remove();
		$('div#seat2 > img[class*="card"]').remove();
		$('div#seat3 > img[class*="card"]').remove();
		$('div#seat4 > img[class*="card"]').remove();
		$('div#seat5 > img[class*="card"]').remove();
		$('div#seat6 > img[class*="card"]').remove();
		$('div#seat7 > img[class*="card"]').remove();
		$('p[class="playerStatus"]').remove();
		$('p[class="dealerStatus"]').remove();
	}
	
	static displayPlayerName(player) {
		var $name = $('<p class="name">').text(player.userId);
		var seatPosition = $('div#seat' + player.seat.position).position();
		$name.attr('style', 'position: absolute; left: ' + (seatPosition.left + 5) + 'px; top: ' + (seatPosition.top -30) + 'px;');
		$name.appendTo('div#table');		
	}
	
	static displayDealerStatus(play) {
		var dealer = play.dealer;
		if (dealer.status !== GamblerStatus.PLAYING) {
			var $p = $('<p class="dealerStatus">').text(dealer.status.toLowerCase());
			$p.appendTo('div#dealerStatus');
		}
	}
	
	static displayPlayersStatus(play) {
		var players = play.players;
		for(var i=0;i<players.length;i++) {
			var player = players[i];
			if (player.status !== GamblerStatus.PLAYING && player.status !== GamblerStatus.LOOSER) {
				Table.__displayPlayerStatus(player);
			}
		}
	}
	
	static __displayPlayerStatus(player) {	
		var $seat = $('div#seat' + player.seat.position);
		// count the images already appended to the seat.
		var cards =  player.hand.cards.length;
		var seatPosition = new Position(7, 20 * cards + 100);
		if (player.status !== GamblerStatus.PLAYING) {
			$("p[id='" + player.userId + player.seat.position + "']").remove();
			var $p = $('<p class="playerStatus">').attr('id', player.userId + player.seat.position).text(player.status.toLowerCase());
			$p.attr('style', 'position: absolute; left: ' + (seatPosition.left) + 'px; top: ' + (seatPosition.top) + 'px;');
			$p.appendTo($seat);
		}
	}
	
	static __buildCardElement(card, name) {
		var $img = null;
		if (card.value === 0) {
			$img = $('<img>', {
				'name': name, 
				'alt': 'back card', 
				'src': 'images/blackjack/back.jpg', 
				'class': 'card invisible'});
		}
		else {
			$img = $('<img>', {
				'name': name, 
				'alt': card.name + ' of ' + card.suit, 
				'src': 'images/blackjack/cards/' + card.suit + '/' + card.name + '.jpg', 
				'class': 'card invisible'});
		}
		return $img;
	}
	
	getSeat(id) {
		var position = id.substring(4);
		switch(position) {
			case '1':
				return this.seatOne;
			case '2':
				return this.seatTwo;
			case '3':
				return this.seatThree;
			case '4':
				return this.seatFour;
			case '5':
				return this.seatFive;
			case '6':
				return this.seatSix;
			case '7':
				return this.seatSeven;
		}
		return 0;
	}
		
	static showMessage(msg) {
		$('h3#hdrResult').html(msg);
	}
}
	

