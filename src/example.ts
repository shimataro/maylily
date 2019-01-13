import maylily from "./maylily";

maylily()
	.then((value) => {
		console.log(value);
	})
	.catch((err) => {
		console.error(err);
	});
