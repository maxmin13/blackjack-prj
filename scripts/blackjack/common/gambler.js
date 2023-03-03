/*jshint esversion: 6 */

import {Hand} from '../common/hand.js';
import {GamblerStatus} from '../common/gamblerstatus.js';

export class Gambler {

	constructor(userId) {
		this.userId = userId;
		this.hand = new Hand();
		this.status = GamblerStatus.PLAYING;	
	}
	
	replaceCardAt(i, card) {
		this.hand.cards[i] = card;
	}
		
	addCard(card) {
		this.hand.cards.push(card);
		var score = this.hand.getScore();	
		if (score === 21) {
			this.status = GamblerStatus.BJ;
		}
		else if (score > 21) {
			this.status = GamblerStatus.BURST;
		}	
	}
	
	reset() {
		this.hand = new Hand();
		this.status = GamblerStatus.PLAYING;
	}
	
	hasCardsToDeal() {
		var hasCards = false;
		var cards = this.hand.cards;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			if (card.dealt === false) {
				hasCards = true;
			}
		}
		return hasCards;
	}
}
