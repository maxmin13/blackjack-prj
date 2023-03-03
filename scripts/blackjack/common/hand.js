/*jshint esversion: 6 */

import {Card} from './card.js';

export class Hand {

	constructor() {
		this.cards = []; /* array of Card objects. */
	}

	getScore() {
		var aces = 0;
		var total = 0;
		for (var i = 0; i < this.cards.length; i++) {
			var card = this.cards[i];
			if (card.value === 1) {
				aces += 1;
			}
			total += card.value;
		}		
		// an ace may be valued 1 or 11.
		for (var i = 0; i < aces; i++) {
			var newTotal = total + 10;
			if (newTotal > 21) {
				break;
			}
			else if (newTotal === 21) {
				total = newTotal;
				break;
			}
			else if (newTotal > total) {
				total = newTotal;
			}
		}	
		return total;
	}
	
}
