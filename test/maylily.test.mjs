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
	it("sequence", async() =>
	{
		const options = {
			generatorId: 0,
		};

		// 1000101110011011111001100001000000000000 000 0000000000 00000000
		mockNow(Date.parse("2019-01-01T00:00:00Z"));
		await expect(maylily(options)).resolves.toEqual("1257485893632000000");
		await expect(maylily()).resolves.toEqual("1257485893632000001");
		await expect(maylily()).resolves.toEqual("1257485893632000002");
		await expect(maylily()).resolves.toEqual("1257485893632000003");
	});
	it("update time", async() =>
	{
		const options = {
			generatorId: 0,
		};

		// 1000101110011011111001100001000000000001 000 0000000000 00000000
		mockNow(Date.parse("2019-01-01T00:00:00Z") + 1);
		await expect(maylily(options)).resolves.toEqual("1257485893634097152");
		await expect(maylily()).resolves.toEqual("1257485893634097153");
		await expect(maylily()).resolves.toEqual("1257485893634097154");
		await expect(maylily()).resolves.toEqual("1257485893634097155");
	});
	it("next tick", async() =>
	{
		const options = {
			generatorId: 0,
			sequenceBits: 2,
		};

		// 1000110000111011100010110011010000000000 000 0000000000 00
		mockNow(Date.parse("2019-02-01T00:00:00Z"));
		await expect(maylily(options)).resolves.toEqual("19735982899200000");
		await expect(maylily()).resolves.toEqual("19735982899200001");
		await expect(maylily()).resolves.toEqual("19735982899200002");
		await expect(maylily()).resolves.toEqual("19735982899200003");

		// update now on next tick
		// 1000110000111011100010110011010000000001 000 0000000000 00
		process.nextTick(() =>
		{
			const now = Date.now();
			mockNow(now + 1);
		});
		await expect(maylily()).resolves.toEqual("19735982899232768");
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
		const options = {
			generatorId: 0,
			sequenceBits: 8,
		};

		mockNow(Date.parse("2019-04-01T00:00:00Z"));
		await expect(maylily(options)).resolves.toEqual("1273793347584000000");
		await expect(maylily({radix: 2})).resolves.toEqual("1000110101101011011000100110100000000000000000000000000000001");
		await expect(maylily({radix: 4})).resolves.toEqual("1012231123010310000000000000002");
		await expect(maylily({radix: 8})).resolves.toEqual("106553304640000000003");
		await expect(maylily({radix: 16})).resolves.toEqual("11ad6c4d00000004");
		await expect(maylily({radix: 32})).resolves.toEqual("13bbc9k000005");
		await expect(maylily({radix: 36})).resolves.toEqual("9oea21h9w5c6");
	});
}
