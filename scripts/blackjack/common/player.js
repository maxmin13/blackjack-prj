/*jshint esversion: 6 */

import {Gambler} from './gambler.js';
import {GamblerStatus} from './gamblerstatus.js';

export class Player extends Gambler {

	constructor(userId, clientId) {
		super(userId);
		this.clientId = clientId;
	}
	
	set seat(seat) {
		this._seat = seat;
	}
	
	get seat() {
		return this._seat;
	}
	
	takeASeat(seat) {
		seat.taken = true;
	        this._seat = seat;
	}
	
	static sortPlayers(players) {		
		for (var i = 0; i < players.length - 1; i++) {
			for (var j = 0; j < players.length - i - 1; j++) {
				if (players[j].seat.position > players[j + 1].seat.position) {
					var temp = players[j];
					players[j] = players[j + 1];
					players[j + 1] = temp;
				}
			}
		}
	}
	
	// Counts how many players are BURST, BJ, PLAYING + STICK, WINNER, LOOSER.
	static getPlayersStatus(players) {
		var bj = 0, burst = 0, inPlay = 0, winner = 0, looser = 0;
		for (var i = 0; i < players.length; i++) {
			var player = players[i];
			if (player.status === GamblerStatus.PLAYING || player.status === GamblerStatus.STICK) {
				inPlay++;
			}
			else if (player.status === GamblerStatus.BJ) {
				bj++;
			}
			else if (player.status === GamblerStatus.BURST) {
				burst++;
			}
			else if (player.status === GamblerStatus.WINNER) {
				winner++;
			}
			else if (player.status === GamblerStatus.LOOSER) {
				looser++;
			}
		}
		
		var statuses = new Map();
		statuses.set(GamblerStatus.BJ, bj);
		statuses.set(GamblerStatus.WINNER, winner);
		statuses.set(GamblerStatus.LOOSER, looser);
		statuses.set(GamblerStatus.BURST, burst);
		statuses.set(GamblerStatus.PLAYING, inPlay); // active + stick players.
		
		return statuses;	
	}
}
