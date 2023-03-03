/*jshint esversion: 6 */

import {Constants} from './constants.js';

export class Utils {

	static debug(msg) {
		if (msg !== null && msg.toString().search("SERVER:") >= 0) {
			if (Constants.EnableServerLogs === true) {
				console.log(msg);
			}
		}	
		else {
			console.log(msg);
		}	
	}
	
	static error(msg) {
		var text = null;
		if (msg !== null) {
			text = 'ERROR: ' + msg.toString();
		}
		console.log(text);
	}
	
	static getRandomIntInclusive(min, max) {
		var mi = Math.ceil(min);
		var ma = Math.floor(max);
		return Math.floor(Math.random() * (ma - mi + 1) + mi); // The maximum is inclusive and the minimum is inclusive
	}
	
}


