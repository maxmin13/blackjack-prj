/*jshint esversion: 6 */

export class Seat {

	constructor(position) {
		this.position = position; // int
		this._taken = false;
	}
	
	get taken() {
		return this._taken;
	}
	
	set taken(taken) {
		this._taken = taken;
	}
}




