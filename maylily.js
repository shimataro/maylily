/*!
 * MayLily - distributable, serverless, and customizable unique ID number generator based on Snowflake
 * https://github.com/shimataro/maylily
 * MIT License
 */
module.exports = (function()
{
	"use strict";

	var timePrev = 0;
	var sequence = 0;
	var optionsG = {
		timeBase: Date.parse("2000-01-01T00:00:00Z"),
		machineId: 0,
		machineBits: 2,
		generatorId: process.pid,
		generatorBits: 7,
		sequenceBits: 5
	};

	/**
	 * @param {Object} options
	 * @return {Promise.<int>} generated ID
	 */
	return function(options)
	{
		// Merge options if specified.
		if(options !== undefined)
		{
			Object.assign(optionsG, options);
		}
		var optionsL = Object.assign({}, optionsG);

		var time = Date.now();
		if(time < timePrev)
		{
			return Promise.reject(errorUnixtimeBackwards(time));
		}

		if(time > timePrev)
		{
			// Reset sequence when unixtime is updated.
			sequence = 0;
			return Promise.resolve(buildId(time, optionsL));
		}

		var sequenceLimit = 1 << optionsL.sequenceBits;
		if(sequence < sequenceLimit)
		{
			// Increment sequence when sequence DOESN'T reached to limit.
			return Promise.resolve(buildId(time, optionsL));
		}

		// Wait until unixtime is updated
		return new Promise(function(resolve, reject)
		{
			var timeout = setInterval(function()
			{
				var time = Date.now();
				if(time < timePrev)
				{
					reject(errorUnixtimeBackwards(time));
				}

				// Clear timer and resolve when time is updated.
				if(time > timePrev)
				{
					clearInterval(timeout);
					timeout = null;

					sequence = 0;
					resolve(buildId(time, optionsL));
				}

				if(sequence < sequenceLimit)
				{
					// Increment sequence when sequence DOESN'T reached to limit.
					resolve(buildId(time, optionsL));
				}
			}, 1);
		});
	};

	/**
	 * build unique ID
	 * @param {int} time unixtime[millisec]
	 * @param {Object} options other options
	 * @return {int} generated ID
	 */
	function buildId(time, options)
	{
		timePrev = time;

		var val = time - options.timeBase;
		val = shiftAndMergeValues(val, options.machineId, options.machineBits);
		val = shiftAndMergeValues(val, options.generatorId, options.generatorBits);
		val = shiftAndMergeValues(val, sequence++, options.sequenceBits);
		return val;
	}

	/**
	 * shift and merge two values
	 * @param {int} hi value to be hi-bits
	 * @param {int} lo value to be lo-bits
	 * @param {int} loBits required bits to represent lo value
	 * @return {int} merged value
	 */
	function shiftAndMergeValues(hi, lo, loBits)
	{
		var loMax = 1 << loBits;
		return (hi * loMax) + (lo % loMax);
	}

	/**
	 * generate error instance for unixtime error
	 * @param {int} time unixtime[millisec]
	 * @return {Error} error instance
	 */
	function errorUnixtimeBackwards(time)
	{
		var message = "Clock moved backwards. Refusing to generate id for " + time + " milliseconds";
		return new Error(message);
	}
})();
