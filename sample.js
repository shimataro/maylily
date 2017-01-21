var maylily = require("./maylily");

// customize
maylily({
	timeBase: Date.parse("2017-01-01T00:00:00Z"), // if your service starts in 2017, this is enough.
	machineBits: 1,                               // if required machines are up to 2, this is enough.
	generatorBits: 0                              // if running process is only 1, this is enough.
});

for(var i = 0; i < 1000; i++)
{
	maylily()
		.then(function(id)
		{
			console.log(id);
		});
}
