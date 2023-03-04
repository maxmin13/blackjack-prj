/*jshint esversion: 6 */

import {Utils} from './common/utils.js';
import {Player} from './common/player.js';
import {Play} from './common/play.js';
import {PlayStatus} from './common/playstatus.js';
import {Table} from './client/table.js';
import {Seat} from './common/seat.js';
import {ClientCasino} from './client/client.js';
import {ClientConstants} from './client/clientconstants.js';
import {Constants} from './common/constants.js';
import {Card} from './common/card.js';

$(document).ready(function() {

	Utils.debug('ready');

	const clientId = 'hotcasino';
	const userId = 'maxmin';
	const client = new ClientCasino(userId);
	const table = new Table();

	$('div#btnHit').toggle();   // hide
	$('div#btnStick').toggle(); // hide
		
	$('div#btnStart').bind('click', function(e) {
		e.stopPropagation();
		Table.clearTable();
		
		if (client.getPlayers().length === 0) {
			Utils.debug('No players sit at the table.');
			Table.showMessage('Take a seat!');
			return;		
		}
		
		client.startPlay();
		
		$('div#btnStart').toggle(); // hide
		
		setTimeout(function() { 
			// After a while trigger the end of the play. Configure the timers to let the players the time to draw the cards.
			Utils.debug('Finalizing  ...');
			client.finalizePlay();
			Utils.debug('Play ended!');	
			
			$('div#btnHit').toggle();   // hide
			$('div#btnStick').toggle(); // hide
			
			setTimeout(function() { 
				$('div#btnStart').toggle(); // display
			},Constants.BetweenPlaysTime);
				
			Table.showMessage('Play is ended!');	
			displayCards(client.play);		
		}, Constants.DrawingTime);
		
		var play = client.play;
		if (play !== null) {	
			Table.showMessage('Play is started!');
			displayCards(client.play)
				.then(() => {
					if (play.status === PlayStatus.HITTING) {
						$('div#btnHit').toggle();   // display
						$('div#btnStick').toggle(); // display	
						Table.showMessage('Draw a card!');
					}
				});
		}
	});
							
	$('div#btnHit').bind('click', function(e) {
		e.stopPropagation();
		client.hitPlayer();
		displayCards(client.play);
	});
	
	$('div#btnStick').bind('click', function(e) {
		e.stopPropagation();
		client.stickPlayer();
		displayCards(client.play);
	});
		
	$('div#seat1, div#seat2, div#seat3, div#seat4, div#seat5, div#seat6, div#seat7').bind('click', function(e) {
		e.stopPropagation();
		var player = new Player(userId, clientId);
		var seat = table.getSeat(this.id);	
		if (seat.taken === false) {
			player.takeASeat(seat);
			client.sendPlayer(player);
			Table.displayPlayerName(player);
			Table.showMessage('Seat ' + seat.position + ' taken!');
		}
		else {
			Utils.debug('Seat ' + seat.position + ' already taken.');
		}
	});
	
	function displayCards(play) {
		return Table.displayPlayCards(play)
			.then(() => {
				Table.displayDealerStatus(play);
				Table.displayPlayersStatus(client.play);
			})
			.catch((error) => Utils.error(error));	
	}
}); 
