/*jshint esversion: 6 */

export class Card {

	constructor(name, suit, value) {
		this.name = name;
		this.suit = suit;
		this.value = value;
		this.dealt = false; // the only mutable property.
		
		//Object.freeze(this);
		Object.defineProperty(this, "name", { configurable: false, writable: false });
		Object.defineProperty(this, "suit", { configurable: false, writable: false });
		Object.defineProperty(this, "value", { configurable: false, writable: false });
	}
}

