/*jshint esversion: 6 */

import {Hand} from '../common/hand.js';
import {Card} from '../common/card.js';
import {Play} from '../common/play.js';
import {Seat} from '../common/seat.js';
import {Player} from '../common/player.js';
import {Gambler} from '../common/gambler.js';
import {GamblerStatus} from '../common/gamblerstatus.js';
import {PlayStatus} from '../common/playstatus.js';
import {Dealer} from '../server/dealer.js';
import {Deck} from '../server/deck.js';
import {Server} from '../server/server.js';

QUnit.test('Gambler hand cards', function(assert) {

	var card = Deck.TwoOfDiamonds;

	assert.equal(card.value, 2);
	assert.equal(card.dealt, false);

	assert.throws(
		function () { 
			card.value = 4;
		},
		function (err) { 
			return err.toString() === 'TypeError: Cannot assign to read only property \'value\' of object \'#<Card>\'' 
		},  
		'Error thrown'
	);
	
	card.dealt = true;
	assert.equal(card.dealt, true);
});

QUnit.test('Gambler hand cards', function(assert) {

	var deck = new Deck();
	var gambler = new Gambler();
	
	var card = Deck.BackCard;
	gambler.hand.cards.push(card);
	card = Deck.AceOfHearts;
	gambler.hand.cards.push(card);
	
	assert.equal(gambler.hand.cards[0].value, 0);
	assert.equal(gambler.hand.cards[1].value, 1);
	
	card = Deck.KingOfHearts;
	gambler.replaceCardAt(0, card);

	assert.equal(gambler.hand.cards[0].value, 10);
	assert.equal(gambler.hand.cards[1].value, 1);
});
   
QUnit.test('Hand score value', function(assert) {

	var deck = new Deck();
	var hand = new Hand();
	
	var card = Deck.BackCard;
	hand.cards.push(card);
	
	var score = hand.getScore();
	 
	assert.equal(score, 0);
	
	card = Deck.AceOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 11, 'one card hand');
	
	hand = new Hand();
	card = Deck.FourOfHearts;
	hand.cards.push(card);
	card = Deck.NineOfHearts;
	hand.cards.push(card);
	card = Deck.SevenOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 20);

	hand = new Hand();
	card = Deck.KingOfHearts;
	hand.cards.push(card);
	card = Deck.TwoOfHearts;
	hand.cards.push(card);
	card = Deck.FiveOfHearts;
	hand.cards.push(card);
	card = Deck.TwoOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 19);
	
	hand = new Hand();
	card = Deck.JackOfHearts;
	hand.cards.push(card);
	card = Deck.QueenOfHearts;
	hand.cards.push(card);
	
	score = hand.getScore();
	 
	assert.equal(score, 20);
	
	hand = new Hand();
	card = Deck.TenOfHearts;
	hand.cards.push(card);
	card = Deck.EightOfHearts;
	hand.cards.push(card);
	card = Deck.SevenOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 25);
	
	hand = new Hand();
	card = Deck.AceOfHearts;
	hand.cards.push(card);
	card = Deck.SevenOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 18);
	
	hand = new Hand();
	card = Deck.AceOfHearts;
	hand.cards.push(card);
	card = Deck.SevenOfHearts;
	hand.cards.push(card);
	card = Deck.FourOfHearts;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 12);
	
	hand = new Hand();
	card = Deck.AceOfSpades;
	hand.cards.push(card);
	card = Deck.AceOfDiamonds;
	hand.cards.push(card);
	card = Deck.EightOfSpades;
	hand.cards.push(card);
	score = hand.getScore();
	 
	assert.equal(score, 20);
});

QUnit.test('Gambler status', function(assert) {

	var deck = new Deck();
	var gambler = new Gambler();
	
	assert.equal(gambler.status, GamblerStatus.PLAYING);
	
	gambler.addCard(Deck.BackCard);
	
	assert.equal(gambler.status, GamblerStatus.PLAYING);
	
	gambler.addCard(Deck.KingOfDiamonds);
	
	assert.equal(gambler.status, GamblerStatus.PLAYING);
	
	gambler.addCard(Deck.KingOfSpades);
	
	assert.equal(gambler.status, GamblerStatus.PLAYING);
	
	gambler.addCard(Deck.AceOfDiamonds);
	
	assert.equal(gambler.status, GamblerStatus.BJ);
	
	gambler.addCard(Deck.ThreeOfDiamonds);
	
	assert.equal(gambler.status, GamblerStatus.BURST);
});

QUnit.test('Player status', function(assert) {

	var deck = new Deck();
	var player = new Player('max', 'hotcasino');
	
	assert.equal(player.status, GamblerStatus.PLAYING);
	
	player.addCard(Deck.BackCard);
	
	assert.equal(player.status, GamblerStatus.PLAYING);
	
	player.addCard(Deck.KingOfDiamonds);
	
	assert.equal(player.status, GamblerStatus.PLAYING);
	
	player.addCard(Deck.KingOfSpades);
	
	assert.equal(player.status, GamblerStatus.PLAYING);
	
	player.addCard(Deck.AceOfDiamonds);
	
	assert.equal(player.status, GamblerStatus.BJ);
	
	player.addCard(Deck.ThreeOfDiamonds);
	
	assert.equal(player.status, GamblerStatus.BURST);
});

QUnit.test('Dealer status', function(assert) {

	var deck = new Deck();
	var dealer = new Dealer('hat');
	
	assert.equal(dealer.status, GamblerStatus.PLAYING);
	
	dealer.addCard(Deck.BackCard);
	
	assert.equal(dealer.status, GamblerStatus.PLAYING);
	
	dealer.addCard(Deck.KingOfDiamonds);
	
	assert.equal(dealer.status, GamblerStatus.PLAYING);
	
	dealer.addCard(Deck.KingOfSpades);
	
	assert.equal(dealer.status, GamblerStatus.PLAYING);
	
	dealer.addCard(Deck.AceOfDiamonds);
	
	assert.equal(dealer.status, GamblerStatus.BJ);
	
	dealer.addCard(Deck.ThreeOfDiamonds);
	
	assert.equal(dealer.status, GamblerStatus.BURST);
});
   
QUnit.test('Finalize play: all players burst', function(assert) {
	
	var server = new Server();
	var players = [];
	var deck = new Deck();
	
	var dealer = new Dealer('hat');
	
	var player1 = new Player('max1', 'hotcasino');
	player1.addCard(Deck.KingOfDiamonds);
	player1.addCard(Deck.EightOfDiamonds);
	player1.addCard(Deck.NineOfDiamonds);
	players.push(player1);
	
	var player2 = new Player('max2', 'hotcasino');
	player2.addCard(Deck.TenOfDiamonds);
	player2.addCard(Deck.SevenOfDiamonds);
	player2.addCard(Deck.QueenOfDiamonds);
	players.push(player2);
	
	var play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlayAtDealerSecondCard(play);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
});

QUnit.test('Finalize play: all players bj', function(assert) {
	
	var server = new Server();
	var players = [];
	var deck = new Deck();
	
	var player1 = new Player('max1', 'hotcasino');
	player1.addCard(Deck.JackOfDiamonds);
	player1.addCard(Deck.AceOfDiamonds);
	players.push(player1);
	
	var player2 = new Player('max2', 'hotcasino');
	player2.addCard(Deck.AceOfSpades);
	player2.addCard(Deck.JackOfClubs);
	player2.addCard(Deck.AceOfDiamonds);
	players.push(player2);
	
	// CASE: dealer has less than 10.
	var dealer = new Dealer('hat'); 
	dealer.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.ThreeOfDiamonds);
	
	var play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlayAtDealerSecondCard(play);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
	
	// CASE: dealer has 10.
	dealer = new Dealer('hat'); 
	dealer.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.EightOfDiamonds);
	
	play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlayAtDealerSecondCard(play);
	
	// expected play still iI FINALIZING status.
	assert.equal(play.status, PlayStatus.FINALIZING);
});

QUnit.test('Finalize play: at least one player has BJ and all the others burst', function(assert) {
	
	var deck = new Deck();
	var server = new Server();
	var players = [];
	
	var player1 = new Player('max1', 'hotcasino');
	player1.addCard(Deck.JackOfDiamonds);
	player1.addCard(Deck.AceOfDiamonds);
	players.push(player1);
	
	var player2 = new Player('max2', 'hotcasino');
	player2.addCard(Deck.JackOfSpades);
	player2.addCard(Deck.TenOfSpades);
	player2.addCard(Deck.JackOfHearts);
	players.push(player2);
	
	// CASE: dealer has less than 10.
	var dealer = new Dealer('hat'); 
	dealer.addCard(Deck.TwoOfSpades);
	dealer.addCard(Deck.ThreeOfSpades);
	
	var play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlayAtDealerSecondCard(play);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
	
	// CASE: dealer has 10.
	dealer = new Dealer('hat'); 
	dealer.addCard(Deck.TwoOfClubs);
	dealer.addCard(Deck.EightOfClubs);
	
	play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlayAtDealerSecondCard(play);
	
	// expected play still iI FINALIZING status.
	assert.equal(play.status, PlayStatus.FINALIZING);
});

QUnit.test('Finalize play: dealer burst or bj', function(assert) {
	
	var server = new Server();
	var players = [];
	var deck = new Deck();
	
	// CASE: dealer burst.
	var dealer = new Dealer('hat'); 
	dealer.addCard(Deck.KingOfClubs);
	dealer.addCard(Deck.ThreeOfClubs);
	dealer.addCard(Deck.TenOfClubs);
	
	var play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlay(play, deck);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
	
	// CASE: dealer has bj.
	dealer = new Dealer('hat'); 
	dealer.addCard(Deck.AceOfDiamonds);
	dealer.addCard(Deck.KingOfDiamonds);
	
	play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlay(play, deck);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
});

QUnit.test('Finalize play: dealer has more then 16', function(assert) {
	var server = new Server();
	var players = [];
	var deck = new Deck();
	
	// CASE: dealer has 17.
	var dealer = new Dealer('hat'); 
	dealer.addCard(Deck.KingOfClubs);
	dealer.addCard(Deck.ThreeOfClubs);
	dealer.addCard(Deck.FourOfClubs);
	
	var play = new Play(players, dealer);
	play.status = PlayStatus.FINALIZING;
	
	server.__finalizePlay(play, deck);
	
	// expected end play.
	assert.equal(play.status, PlayStatus.END);
});

QUnit.test('Finalize play: dealer has less then 16 or 16', function(assert) {

	var server = new Server();
	var players = [];
	var deck = new Deck();
	
	// CASE: dealer has 16.
	var dealer = new Dealer('hat'); 
	dealer.addCard(Deck.KingOfClubs);
	dealer.addCard(Deck.ThreeOfClubs);
	dealer.addCard(Deck.ThreeOfSpades);
	
	// CASE: at least one player has BJ and all the others burst
	var player1 = new Player('max1', 'hotcasino');
	player1.addCard(Deck.JackOfDiamonds);
	player1.addCard(Deck.AceOfDiamonds);
	players.push(player1);
	
	var player2 = new Player('max2', 'hotcasino');
	player2.addCard(Deck.JackOfSpades);
	player2.addCard(Deck.TenOfSpades);
	player2.addCard(Deck.JackOfHearts);
	players.push(player2);
	
	var play1 = new Play(players, dealer);
	play1.status = PlayStatus.FINALIZING;
	
	server.__finalizePlay(play1, deck);
	
	// expected end play.
	assert.equal(play1.status, PlayStatus.END);
	
	// CASE: one player has BJ 
	var player3 = new Player('ma3', 'hotcasino');
	player3.addCard(Deck.JackOfDiamonds);
	player3.addCard(Deck.AceOfDiamonds);
	players.push(player3);
	
	var player4 = new Player('max4', 'hotcasino');
	player4.addCard(Deck.JackOfSpades);
	player4.addCard(Deck.TenOfSpades);
	players.push(player4);
	
	var play2 = new Play(players, dealer);
	play2.status = PlayStatus.FINALIZING;
	
	server.__finalizePlay(play2, deck);
	
	// expected end play.
	assert.equal(play2.status, PlayStatus.FINALIZING);
});

QUnit.test('Get winners', function(assert) {

	// case: the player is busted.
	
	var seat = new Seat(1);
	var player = new Player('max', 'hotcasino');
	player.seat = seat;
	var players = [];
	players.push(player);
	var dealer = new Dealer('hat');
	var play = new Play(players, dealer);
	var server = new Server();
	server.play = play;

	player.addCard(Deck.KingOfDiamonds);
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.ThreeOfDiamonds);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.LOOSER);
	
	// case: the player has BJ.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.KingOfDiamonds);
	player.addCard(Deck.AceOfDiamonds);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.WINNER);
	
	// case: dealer has BJ.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.TwoOfDiamonds);
	player.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.KingOfSpades);
	dealer.addCard(Deck.AceOfSpades);
	
	server.__getWinners();	
	
	assert.equal(player.status, GamblerStatus.LOOSER);
	
	// case: player and dealer has BJ.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.AceOfDiamonds);
	dealer.addCard(Deck.KingOfSpades);
	dealer.addCard(Deck.AceOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.WINNER);
	
	// case: the dealer is busted.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.ThreeOfDiamonds);
	player.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.QueenOfSpades);
	dealer.addCard(Deck.KingOfSpades);
	dealer.addCard(Deck.NineOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.WINNER);
	
	// case: the dealer is busted and the player is busted.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.KingOfDiamonds);
	player.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.QueenOfSpades);
	dealer.addCard(Deck.KingOfSpades);
	dealer.addCard(Deck.NineOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.LOOSER);
	
	// case: the dealer has the higher score.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.QueenOfSpades);
	dealer.addCard(Deck.KingOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.LOOSER);
	
	// case: the dealer and the player have the same score.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.TwoOfDiamonds);
	dealer.addCard(Deck.QueenOfSpades);
	dealer.addCard(Deck.TwoOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.WINNER);

	// case: the player has the higher score.
	
	player = new Player('max', 'hotcasino');
	player.seat = seat;
	players = [];
	players.push(player);
	dealer = new Dealer('hat');
	play = new Play(players, dealer);
	server = new Server();
	server.play = play;
	
	player.addCard(Deck.QueenOfDiamonds);
	player.addCard(Deck.FourOfDiamonds);
	dealer.addCard(Deck.QueenOfSpades);
	dealer.addCard(Deck.TwoOfSpades);
	
	server.__getWinners();
	
	assert.equal(player.status, GamblerStatus.WINNER);
});

QUnit.test('Deck cards', function(assert) {

	var deck = new Deck();
	
	// 8 decks in the shoe.
	assert.equal(deck.shoe.length, 416); 
	assert.deepEqual(deck.shoe[0], Deck.AceOfDiamonds); 
	assert.deepEqual(deck.shoe[415], Deck.KingOfClubs); 
});

QUnit.test('Sort players by seat', function(assert) {

	// case: 1 players.
	var players = [];

	var player1 = new Player('max1', 'hotcasino'); 
	var seat1 = new Seat(1);
	seat1.taken = true;
	player1.seat = seat1;
	players.push(player1);
	
	Player.sortPlayers(players);
	
	assert.equal(players[0].seat.position, 1);
	
	// case: 2 players.
	players = [];
	
	var player2 = new Player('max2', 'hotcasino'); 
	var seat2 = new Seat(2);
	seat2.taken = true;
	player2.seat = seat2;
		
	players.push(player2);
	players.push(player1);
	
	Player.sortPlayers(players);
	
	assert.equal(players[0].seat.position, 1);
	assert.equal(players[1].seat.position, 2);
	
	// case: more the 2 players.
	players = [];
	
	var player2 = new Player('max2', 'hotcasino'); 
	var seat2 = new Seat(2);
	seat2.taken = true;
	player2.seat = seat2;
	
	var player3 = new Player('max3', 'hotcasino'); 
	var seat3 = new Seat(3);
	seat3.taken = true;
	player3.seat = seat3;
	
	var player4 = new Player('max4', 'hotcasino'); 
	var seat4 = new Seat(4);
	seat4.taken = true;
	player4.seat = seat4;
	
	var player5 = new Player('max5', 'hotcasino'); 
	var seat5 = new Seat(5);
	seat5.taken = true;
	player5.seat = seat5;
		
	players.push(player2);
	players.push(player1);
	players.push(player5);
	players.push(player3);
	players.push(player4);
	
	Player.sortPlayers(players);
	
	assert.equal(players[0].seat.position, 1);
	assert.equal(players[1].seat.position, 2);
	assert.equal(players[2].seat.position, 3);
	assert.equal(players[3].seat.position, 4);
	assert.equal(players[4].seat.position, 5);
});
