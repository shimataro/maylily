/**
 * @description MayLily - distributable, serverless, and customizable unique ID generator based on Snowflake
 * @license MIT License
 * https://github.com/shimataro/maylily
 */
export default maylily;

import BigInteger from "big-integer";

/**
 * @typedef {Object} MaylilyOptions
 * @property {number} radix radix of generated ID
 * @property {number} timeBase base time [milliseconds]
 * @property {number} machineId ID of machine, use when generate ID by multiple machines
 * @property {number} machineBits size of machineId
 * @property {number} generatorId ID of generator
 * @property {number} generatorBits size of generatorId
 * @property {number} sequenceBits size of sequence
 */
/**
 * @callback Resolve resolver
 * @param {string} value value to return
 * @returns {void}
 */
/**
 * @callback Reject rejector
 * @param {Error} err error to return
 * @returns {void}
 */

const DEFAULT_BITS_MACHINE = 3; // up to 8 machines
const DEFAULT_BITS_GENERATOR = 10; // 0-1023
const DEFAULT_BITS_SEQUENCE = 8; // 0-255

/** @type {MaylilyOptions} */
const optionsGlobal = {
	radix: 10,
	timeBase: Date.parse("2000-01-01T00:00:00Z"),
	machineId: 0,
	machineBits: DEFAULT_BITS_MACHINE,
	generatorId: process.pid % (1 << DEFAULT_BITS_GENERATOR),
	generatorBits: DEFAULT_BITS_GENERATOR,
	sequenceBits: DEFAULT_BITS_SEQUENCE,
};

let timePrev = 0;
let sequence = 0;

/**
 * unique ID generator
 * @param {?MaylilyOptions} [options = null] ID options
 * @return {Promise<string>} generated ID
 */
function maylily(options = null)
{
	// Merge options if specified.
	if(options !== null)
	{
		Object.assign(optionsGlobal, options);
	}

	return new Promise((resolve, reject) =>
	{
		resolveId(resolve, reject);
	});
}

/**
 * generate and resolve ID
 * @param {Resolve} resolve resolver
 * @param {Reject} reject rejector
 * @returns {void}
 */
function resolveId(resolve, reject)
{
	const time = Date.now();
	if(time < timePrev)
	{
		reject(errorTimeBackwards(time));
		return;
	}

	// Reset sequence when time is updated.
	if(time > timePrev)
	{
		sequence = 0;
	}

	const sequenceLimit = 1 << optionsGlobal.sequenceBits;
	if(sequence < sequenceLimit)
	{
		// Increment sequence when sequence DOESN'T reach to limit.
		resolve(buildId(time, optionsGlobal));
		return;
	}

	// next time...
	setTimeout(resolveId, 1, resolve, reject);
}

/**
 * build unique ID
 * @param {number} time UNIX time[milliseconds]
 * @param {MaylilyOptions} options other options
 * @return {string} generated ID
 */
function buildId(time, options)
{
	timePrev = time;

	return BigInteger(time - options.timeBase)
		.shiftLeft(options.machineBits).add(options.machineId)
		.shiftLeft(options.generatorBits).add(options.generatorId)
		.shiftLeft(options.sequenceBits).add(sequence++)
		.toString(options.radix);
}

/**
 * generate error instance for time error
 * @param {number} time UNIX time[milliseconds]
 * @return {Error} error instance
 */
function errorTimeBackwards(time)
{
	const message = `Clock moved backwards. Refusing to generate id for ${time} milliseconds`;
	return new Error(message);
}
