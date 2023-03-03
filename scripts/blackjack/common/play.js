/*jshint esversion: 6 */

import {PlayStatus} from './playstatus.js';
import {GamblerStatus} from './gamblerstatus.js';

export class Play {
	
	constructor(players, dealer) {
		this.dealer = dealer;
		this.status = PlayStatus.STARTED;
		this.players = players; // list of Player objects
	}
	
}
