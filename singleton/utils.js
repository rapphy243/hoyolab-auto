const crypto = require("node:crypto");

module.exports = class UtilsSingleton {
	static DS_SALT = "6s25p5ox5y14umn1p61aqyyvbvvl3lrt";

	static timeUnits = {
		h: { m: 60, s: 3600, ms: 3600.0e3 },
		m: { s: 60, ms: 60.0e3 },
		s: { ms: 1.0e3 }
	};

	/**
	 * @inheritdoc
	 * @returns {UtilsSingleton}
	 */
	static singleton () {
		if (!UtilsSingleton.module) {
			UtilsSingleton.module = new UtilsSingleton();
		}

		return UtilsSingleton.module;
	}

	formatTime (seconds = 0) {
		const array = [];

		if (seconds >= UtilsSingleton.timeUnits.h.s) {
			const hours = Math.floor(seconds / UtilsSingleton.timeUnits.h.s);
			seconds -= hours * UtilsSingleton.timeUnits.h.s;
			array.push(`${hours} hr`);
		}

		if (seconds >= UtilsSingleton.timeUnits.m.s) {
			const minutes = Math.floor(seconds / UtilsSingleton.timeUnits.m.s);
			seconds -= minutes * UtilsSingleton.timeUnits.m.s;
			array.push(`${minutes} min`);
		}

		if (seconds >= 0 || array.length === 0) {
			array.push(`${this.round(seconds, 3)} sec`);
		}

		return array.join(", ");
	}

	round (number, precision = 0) {
		return Math.round(number * (10 ** precision)) / (10 ** precision);
	}

	escapeCharacters (string) {
		return string.replace(/[_[\]()~`>#+\-=|{}.!]/g, "\\$&");
	}

	cheerio (html) {
		const cheerio = require("cheerio");
		return cheerio.load(html);
	}

	generateDS () {
		const time = (Date.now() / 1000).toFixed(0);
		const random = this.randomString();
		const hash = this.hash(`salt=${UtilsSingleton.DS_SALT}&t=${time}&r=${random}`);

		return `${time},${random},${hash}`;
	}

	fieldsBuilder (data, options = {}) {
		const fields = [];
		for (const key in data) {
			if (Object.hasOwnProperty.call(data, key)) {
				const value = data[key];
				fields.push({ name: this.capitalize(key), value, inline: options[key] ?? true });
			}
		}

		return fields;
	}

	convertCase (text, caseFrom, caseTo) {
		if (typeof text !== "string") {
			throw new app.Error({
				message: "Text must be typeof string",
				args: { text, caseFrom, caseTo }
			});
		}

		let words = [];
		if (caseFrom === "camel" && caseTo === "snake") {
			words = text.split(/(?=[A-Z])/);
		}
		else if (caseFrom === "snake" && caseTo === "camel") {
			words = text.split("_");
		}
		else if (caseFrom === "kebab" && caseTo === "camel") {
			words = text.split("-");
		}
		else if (caseFrom === "text" && caseTo === "camel") {
			words = text.split(" ");
		}

		words = words.filter(Boolean);

		let result = "";
		if (caseTo === "snake") {
			result = words.map(i => this.capitalize(i)).join("_");
		}
		else if (caseTo === "kebab") {
			result = words.join("-");
		}
		else if (caseTo === "camel") {
			result = words.map((i, ind) => (ind === 0) ? i.toLowerCase() : this.capitalize(i)).join("");
		}

		return result.replace(/id$/i, "ID");
	}

	capitalize (string) {
		return string[0].toUpperCase() + string.substring(1);
	}

	randomString () {
		let result = "";
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const length = 6;

		for (let i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}

		return result;
	}

	hash (string) {
		return crypto
			.createHash("md5")
			.update(string)
			.digest("hex");
	}
};
