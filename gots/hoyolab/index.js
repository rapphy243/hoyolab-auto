const definition = {
	name: "HoYoLab",
	optionsType: "object",
	options: {
		headers: {
			Referer: "https://act.hoyolab.com",
			"x-rpc-app_version": "1.5.0",
			"x-rpc-client_type": 5,
			"x-rpc-language": "en-us",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
		}
	},
	parent: "Global"
};

module.exports = definition;
