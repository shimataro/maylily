import maylily from "./maylily";

// customize
maylily({
	timeBase: Date.parse("2017-01-01T00:00:00Z"), // if your service starts in 2017, this is enough.
	machineBits: 1, // if required number machines are up to 2, this is enough.
});

for(let count = 0; count < 1000; count++)
{
	maylily()
		.then((id) =>
		{
			console.log(id); // eslint-disable-line no-console
		});
}
