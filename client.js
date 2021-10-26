const WebSocket = require('ws');
const fetch = require("node-fetch");
const RPC = require("discord-rpc");

function danceTillYouDie(url, callback) {
	return new Promise(async (res, rej) => {
		try {
			const clientReq = await fetch("http://127.0.0.1:2020/json/list");
			res(clientReq)
		} catch {
			console.log("fail")
			await danceTillYouDie(url, callback);
			
		}
	})
};

(async () => {
	const clientsResponse = await danceTillYouDie("http://127.0.0.1:2020/json/list");

	const clients = await clientsResponse.json();
	
	clients.forEach(async client => {
		if(client.url.includes("discord.com")) {
			console.log("Found discord client!")
			
			await new Promise(resolve => setTimeout(resolve, 500))

			const ws = new WebSocket(client.webSocketDebuggerUrl)

			ws.on("open", () => {
				console.log("ws")
				injectJS(50, `
				async function yeah() {
				while(!document.querySelector(\`*[data-list-item-id="guildsnav___home"]\`)) {
					await new Promise(r => setTimeout(r, 100));
				}

				scriptElem = document.createElement('script');

				scriptElem.setAttribute("src", "https://f3oall.github.io/awesome-notifications/dist/index.var.js")
				scriptElem.onload = () => {
					LinkElem = document.createElement('link');

					LinkElem.setAttribute("href", "https://f3oall.github.io/awesome-notifications/dist/style.css")
					LinkElem.setAttribute("rel", "stylesheet")
					LinkElem.onload = () => {
						window.notifier = new AWN();
						console.log("sucesfully injected")
						window.notifier.success("sucesfully injected");
					}
					document.body.appendChild(LinkElem);
					delete LinkElem;
				}
				document.body.appendChild(scriptElem);
				delete scriptElem;
				}
				yeah();
				`, ws)

				setInterval(() => {
					injectJS(50, `
					bb = [...document.all].find(e => /wordmark-(.*)/gm.test(e.className));
					
					
					bb.textContent = "Nodecord ${process.version} ${new Date().toLocaleTimeString()}";
					bb.style.color = "white";
					bb.style.fontSize = "14px";
					`, ws)
				}, 1000)
			})

			ws.on("message", (m,b)=>{console.log(m.toString())})
		}
	})
})();



function injectJS(id, expression, ws) {
	ws.send(JSON.stringify({
		id,
		method: "Runtime.evaluate",
		params: {
			contextId: 1,
			doNotPauseOnExceptionsAndMuteConsole: false,
			expression,
			generatePreview: false,
			includeCommandLineAPI: true,
			objectGroup: "console",
			returnByValue: false,
			userGesture: true
		}
	}))
}