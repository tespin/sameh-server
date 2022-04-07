let lat, lon;

let api = "";
let size = "size=600x600";
let fov = "&fov=40";
let heading = "&heading=";
let pitch = "&pitch=90";
let apiKey = "";
let base64 = '';
let stviewimg;
let json;

const domain = '';
const socket = io(domain);

// postCoords();

function preload() {
}

function setup() {
	createCanvas(500, 500);

	postCoords();

	// socket = io.connect(domain);

// 	socket.on('currentLoc',
// 		data => {
// 			console.log(`got ${data.latitude} and ${data.longitude}`);
// 			socket.broadcast.emit('currentLoc', data);
// 		});
// }
}

function draw() {

}

function sendCoords(lat, lon) {
	console.log(`sending ${lat} and ${lon}`);
	let data = {
		latitude: lat,
		longitude: lon
	};

	socket.emit('currentLoc', data);
}

function postCoords() {
	const button = document.getElementById('submit');
	button.addEventListener('click', async event => {
		stviewimg = loadImage(getUrl(), img => {
			image(img, 0, 0);
		});

		base64 = stviewimg.canvas.toDataURL('image/jpeg');
		console.log(base64);
		sendCoords(lat, lon); 
		const data = {lat, lon, base64};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		const response = await fetch('/api', options);
		const json = await response.json();
		// console.log(json.latitude);

	});

	if (navigator.geolocation) {
		console.log('geolocation available');
		navigator.geolocation.getCurrentPosition(async position => {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			document.getElementById('latitude').textContent = lat;
			document.getElementById('longitude').textContent = lon;
		});
	}  else {
		console.log('geolocation not available');
	}
}

function getUrl() {
	let loc = `&location=${lat},${lon}`;
	// let loc = '&location=34.0805,-118.2844';
	let url = api + size + loc + fov + heading + pitch + apiKey;
	console.log(url);
	return url;
}