import maylily from "maylily"; // eslint-disable-line import/no-unresolved

{
	describe("sequence", testSequence);
	describe("radix", testRadix);
}

/**
 * mock Date.now()
 * @param {number} value date value
 * @returns {void}
 */
function mockNow(value)
{
	Date.now = () =>
	{
		return value;
	};
}

/**
 * test sequences
 * @returns {void}
 */
function testSequence()
{
	it("generates ID", async() =>
	{
		const options = {
			generatorId: 0,
		};

		// sequence
		mockNow(Date.parse("2019-01-01T00:00:00Z"));
		await expect(maylily(options)).resolves.toEqual("1257485893632000000");
		await expect(maylily()).resolves.toEqual("1257485893632000001");
		await expect(maylily()).resolves.toEqual("1257485893632000002");
		await expect(maylily()).resolves.toEqual("1257485893632000003");

		// update now
		mockNow(Date.parse("2019-01-01T00:00:01Z"));
		await expect(maylily()).resolves.toEqual("1257485895729152000");
		await expect(maylily()).resolves.toEqual("1257485895729152001");
		await expect(maylily()).resolves.toEqual("1257485895729152002");
		await expect(maylily()).resolves.toEqual("1257485895729152003");
	});
	it("rewinds time", async() =>
	{
		mockNow(Date.parse("2000-01-01T00:00:00Z"));
		await expect(maylily()).rejects.toThrow();
	});
}

/**
 * test radix
 * @returns {void}
 */
function testRadix()
{
	it("change radix", async() =>
	{
		mockNow(Date.parse("2019-04-01T00:00:00Z"));
		await expect(maylily()).resolves.toEqual("1273793347584000000");
		await expect(maylily({radix: 2})).resolves.toEqual("1000110101101011011000100110100000000000000000000000000000001");
		await expect(maylily({radix: 4})).resolves.toEqual("1012231123010310000000000000002");
		await expect(maylily({radix: 8})).resolves.toEqual("106553304640000000003");
		await expect(maylily({radix: 16})).resolves.toEqual("11ad6c4d00000004");
		await expect(maylily({radix: 32})).resolves.toEqual("13bbc9k000005");
		await expect(maylily({radix: 36})).resolves.toEqual("9oea21h9w5c6");
	});
}
