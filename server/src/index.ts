import http from "http";
import io from "socket.io";
import express from "express";
import { getRandomizedPhotosFromFolder } from "./photo-crawler/photo-crawler.service";
import path from "path";

const photoSource = process.env.SOURCE || "/home/pi/Pictures"

async function main() {
	let availableImages: string[] = [];

	async function scanImages() {
		availableImages = await getRandomizedPhotosFromFolder(photoSource);
		return availableImages;
	}
	await scanImages();

	function getNextImage() {
		const image = availableImages.shift();
		if (image !== undefined) {
			availableImages.push(image);
			return image;
		}
		return null;
	}

	const app = express();
	app.use(express.json());
	app.use("/photos", express.static(photoSource));

	app.get("/get-socket-io", (req, res) => {
		res.redirect("/socket.io/socket.io.js");
	});

	app.get("/scan", async (_, res, next) => {
		try {
			await scanImages();
			res.send(availableImages);
		} catch (err) {
			next(err);
		}
	});

	app.use(express.static(path.join(__dirname, "../../client/build")));
	app.get("/*", (req, res) => {
		res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
	});

	const server = http.createServer(app);
	const socketServer = io(server);

	let clientsCount = 0;

	setInterval(() => {
		if (clientsCount) {
			const nextImage = getNextImage();
			console.log(nextImage);
			socketServer.emit("nextImage", nextImage);
		}
	}, 15000);

	socketServer.on("connect", (socket) => {
		console.log(`Client connected, #clients: ${++clientsCount}`);
		socket.on("disconnect", () => {
			console.log(`Client disconnected, #clients ${--clientsCount}`);
		});
	});

	server.listen(48383, () => {
		console.log(`listening on ${JSON.stringify(server.address(), null, 2)}`);
	});
}

main().then(() => console.log("running..."), console.error);
