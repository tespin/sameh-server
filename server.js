const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
	cors: {
		origin:'*',
		methods: ['GET', 'POST'],
		allowedHeaders: ["content-type"],
		credentials: true
	}
});
require('dotenv').config();

async function main() {

	app.use(cors());

	io.on('connection', (socket) => {
		console.log('user connected');
		
		// socket.on('mouse', 
		// 	(data) => {
		// 		console.log(`received ${data.x} and ${data.y}`);
		// 		socket.broadcast.emit('mouse', data);
		// 	})
		socket.on('currentLoc', (data) => {
			console.log(`received ${data.latitude} and ${data.longitude}`);
			socket.broadcast.emit('currentLoc', data);
		});

		socket.on('disconnect', () => {
			console.log('user has disconnected');
		});
	});

	const port = process.env.PORT || 3000;
	http.listen(port, () => console.log(`listening at ${port}`));
	app.use(express.static('public'));
	app.use(express.json({limit: '1mb'}));

	app.post('/api', (request, response) => {
		console.log('I got a request!');
		const data = request.body;
		console.log(data);
		response.json({
			status: 'success',
			latitude: data.lat,
			longitude: data.lon,
			base64: data.base64
		});
	});
}

main();

