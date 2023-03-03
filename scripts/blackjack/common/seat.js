/*jshint esversion: 6 */

export class Seat {

	constructor(position) {
		this.position = position;
		this._taken = false;
	}
	
	get taken() {
		return this._taken;
	}
	
	set taken(taken) {
		this._taken = taken;
	}
}




