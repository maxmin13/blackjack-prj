/*jshint esversion: 6 */

import {Player} from '../common/player.js';
import {Utils} from '../common/utils.js';
import {GamblerStatus} from '../common/gamblerstatus.js';
import {PlayStatus} from '../common/playstatus.js';
import {Server} from '../server/server.js';

export class ClientCasino {

	constructor(clientId) {
		this.clientId = clientId;
		this._server = new Server();
	}
	
	get server() {
		return this._server;
	}
	
	get play() {
		return this._play;
	}
	
	set play(play) {
		this._play = play;
	}
				
	sendPlayer(player) {
		this._server.addPlayer(player);
	}
		
	startPlay() {
		this._play = this._server.startPlay();
	}
	
	hitPlayer() {
		var player = null;
		if (this._play.status === PlayStatus.HITTING) {
			player = this.__getPlayer();	
			if (player !== null) {
				player = this._server.hitPlayer(player);
			}
			else {
				Utils.debug('Player not found when hitting.');
			}			
		}
	}
	
	stickPlayer() {
		if (this._play.status === PlayStatus.HITTING) {
			var player = this.__getPlayer();	
			if (player !== null) {
				this._server.stickPlayer(player);
			}			
		}
	}
	
	// get the first PLAYING player in play.
	__getPlayer() {
		for(var i = this._play.players.length -1; i >=0; i--) {
			var player = this._play.players[i];		
			if (player.status === GamblerStatus.PLAYING) {
				return player;
			}		
		}
		return null;
	}	
}
 
