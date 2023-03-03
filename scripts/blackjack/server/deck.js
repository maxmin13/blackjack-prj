/*jshint esversion: 6 */

import {Card} from '../common/card.js';
import {Utils} from '../common/utils.js';

export class Deck {

	// re-shuffle after drawing 208 cards.
	static CatCardIdx = 208; 

	static __BackCard = new Card('BackCard', 'BackCard', 0); 
	
	static AceOfDiamonds = new Card("Ace", "Diamonds", 1);
	static TwoOfDiamonds = new Card("Two", "Diamonds", 2);
	static ThreeOfDiamonds = new Card("Three", "Diamonds", 3);
	static FourOfDiamonds = new Card("Four", "Diamonds", 4);
	static FiveOfDiamonds = new Card("Five", "Diamonds", 5);
	static SixOfDiamonds = new Card("Six", "Diamonds", 6);
	static SevenOfDiamonds = new Card("Seven", "Diamonds", 7);
	static EightOfDiamonds = new Card("Eight", "Diamonds", 8);
	static NineOfDiamonds = new Card("Nine", "Diamonds", 9);
	static TenOfDiamonds = new Card("Ten", "Diamonds", 10);
	static JackOfDiamonds = new Card("Jack", "Diamonds", 10);
	static QueenOfDiamonds = new Card("Queen", "Diamonds", 10);
	static KingOfDiamonds = new Card("King", "Diamonds", 10);		
	static AceOfSpades = new Card("Ace", "Spades", 1);
	static TwoOfSpades = new Card("Two", "Spades", 2);
	static ThreeOfSpades = new Card("Three", "Spades", 3);
	static FourOfSpades = new Card("Four", "Spades", 4);
	static FiveOfSpades = new Card("Five", "Spades", 5);
	static SixOfSpades = new Card("Six", "Spades", 6);
	static SevenOfSpades = new Card("Seven", "Spades", 7);
	static EightOfSpades = new Card("Eight", "Spades", 8);
	static NineOfSpades = new Card("Nine", "Spades", 9);
	static TenOfSpades = new Card("Ten", "Spades", 10);
	static JackOfSpades = new Card("Jack", "Spades", 10);
	static QueenOfSpades = new Card("Queen", "Spades", 10);
	static KingOfSpades = new Card("King", "Spades", 10);			
	static AceOfHearts = new Card("Ace", "Hearts", 1);
	static TwoOfHearts = new Card("Two", "Hearts", 2);
	static ThreeOfHearts = new Card("Three", "Hearts", 3);
	static FourOfHearts = new Card("Four", "Hearts", 4);
	static FiveOfHearts = new Card("Five", "Hearts", 5);
	static SixOfHearts = new Card("Six", "Hearts", 6);
	static SevenOfHearts = new Card("Seven", "Hearts", 7);
	static EightOfHearts = new Card("Eight", "Hearts", 8);
	static NineOfHearts = new Card("Nine", "Hearts", 9);
	static TenOfHearts = new Card("Ten", "Hearts", 10);
	static JackOfHearts = new Card("Jack", "Hearts", 10);
	static QueenOfHearts = new Card("Queen", "Hearts", 10);
	static KingOfHearts = new Card("King", "Hearts", 10);			
	static AceOfClubs = new Card("Ace", "Clubs", 1);
	static TwoOfClubs = new Card("Two", "Clubs", 2);
	static ThreeOfClubs = new Card("Three", "Clubs", 3);
	static FourOfClubs = new Card("Four", "Clubs", 4);
	static FiveOfClubs = new Card("Five", "Clubs", 5);
	static SixOfClubs = new Card("Six", "Clubs", 6);
	static SevenOfClubs = new Card("Seven", "Clubs", 7);
	static EightOfClubs = new Card("Eight", "Clubs", 8);
	static NineOfClubs = new Card("Nine", "Clubs", 9);
	static TenOfClubs = new Card("Ten", "Clubs", 10);
	static JackOfClubs = new Card("Jack", "Clubs", 10);
	static QueenOfClubs = new Card("Queen", "Clubs", 10);
	static KingOfClubs = new Card("King", "Clubs", 10);

	constructor() {
		this.shuffle();
	}
	
	shuffle() {
		this.__drawnCards = [];
		this.shoe = [];
		
		// build an 8 decks shoe.
		for (var i = 0; i < 8; i++) {
			this.shoe.push(this.__clone(Deck.AceOfDiamonds));
			this.shoe.push(this.__clone(Deck.TwoOfDiamonds));
			this.shoe.push(this.__clone(Deck.ThreeOfDiamonds));
			this.shoe.push(this.__clone(Deck.FourOfDiamonds));
			this.shoe.push(this.__clone(Deck.FiveOfDiamonds));
			this.shoe.push(this.__clone(Deck.SixOfDiamonds));
			this.shoe.push(this.__clone(Deck.SevenOfDiamonds));
			this.shoe.push(this.__clone(Deck.EightOfDiamonds));
			this.shoe.push(this.__clone(Deck.NineOfDiamonds));
			this.shoe.push(this.__clone(Deck.TenOfDiamonds));
			this.shoe.push(this.__clone(Deck.JackOfDiamonds));
			this.shoe.push(this.__clone(Deck.QueenOfDiamonds));
			this.shoe.push(this.__clone(Deck.KingOfDiamonds));	
			this.shoe.push(this.__clone(Deck.AceOfSpades));
			this.shoe.push(this.__clone(Deck.TwoOfSpades));
			this.shoe.push(this.__clone(Deck.ThreeOfSpades));
			this.shoe.push(this.__clone(Deck.FourOfSpades));
			this.shoe.push(this.__clone(Deck.FiveOfSpades));
			this.shoe.push(this.__clone(Deck.SixOfSpades));
			this.shoe.push(this.__clone(Deck.SevenOfSpades));
			this.shoe.push(this.__clone(Deck.EightOfSpades));
			this.shoe.push(this.__clone(Deck.NineOfSpades));
			this.shoe.push(this.__clone(Deck.TenOfSpades));
			this.shoe.push(this.__clone(Deck.JackOfSpades));
			this.shoe.push(this.__clone(Deck.QueenOfSpades));
			this.shoe.push(this.__clone(Deck.KingOfSpades));			
			this.shoe.push(this.__clone(Deck.AceOfHearts));
			this.shoe.push(this.__clone(Deck.TwoOfHearts));
			this.shoe.push(this.__clone(Deck.ThreeOfHearts));
			this.shoe.push(this.__clone(Deck.FourOfHearts));
			this.shoe.push(this.__clone(Deck.FiveOfHearts));
			this.shoe.push(this.__clone(Deck.SixOfHearts));
			this.shoe.push(this.__clone(Deck.SevenOfHearts));
			this.shoe.push(this.__clone(Deck.EightOfHearts));
			this.shoe.push(this.__clone(Deck.NineOfHearts));
			this.shoe.push(this.__clone(Deck.TenOfHearts));
			this.shoe.push(this.__clone(Deck.JackOfHearts));
			this.shoe.push(this.__clone(Deck.QueenOfHearts));
			this.shoe.push(this.__clone(Deck.KingOfHearts));			
			this.shoe.push(this.__clone(Deck.AceOfClubs));
			this.shoe.push(this.__clone(Deck.TwoOfClubs));
			this.shoe.push(this.__clone(Deck.ThreeOfClubs));
			this.shoe.push(this.__clone(Deck.FourOfClubs));
			this.shoe.push(this.__clone(Deck.FiveOfClubs));
			this.shoe.push(this.__clone(Deck.SixOfClubs));
			this.shoe.push(this.__clone(Deck.SevenOfClubs));
			this.shoe.push(this.__clone(Deck.EightOfClubs));
			this.shoe.push(this.__clone(Deck.NineOfClubs));
			this.shoe.push(this.__clone(Deck.TenOfClubs));
			this.shoe.push(this.__clone(Deck.JackOfClubs));
			this.shoe.push(this.__clone(Deck.QueenOfClubs));
			this.shoe.push(this.__clone(Deck.KingOfClubs));
		}
	}
	
	drawCard() {
		var cardIdx = 0;
		var good_card = false;		
		do {
			cardIdx = Utils.getRandomIntInclusive(0,415);
			good_card = $.inArray(cardIdx, this.__drawnCards) == -1;
		} 
		while(!good_card);	
		this.__drawnCards.push(cardIdx);		
		return this.shoe[cardIdx];	
	}
		
	checkDeck() {
		if (this.__drawnCards.length > Deck.CatCardIdx) {
			this.shuffle();
			Utils.debug('Deck shuffled!');
		}
	}
	
	__clone(card) {
		return new Card(card.name, card.suit, card.value);
	}
	
	static get BackCard() {
		return new Card(Deck.__BackCard.name, Deck.__BackCard.suit, Deck.__BackCard.value);
	}
}

