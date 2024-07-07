const { CronJob } = require("cron");

const CheckIn = require("./check-in/index.js");
const CodeRedeem = require("./code-redeem/index.js");
const DailiesReminder = require("./dailies-reminder/index.js");
const Expedition = require("./expedition/index.js");
const MissedCheckIn = require("./missed-check-in/index.js");
const RealmCurrency = require("./realm-currency/index.js");
const ShopStatus = require("./shop-status/index.js");
const Stamina = require("./stamina/index.js");
const WeekliesReminder = require("./weeklies-reminder/index.js");

let config;
try {
	config = require("../config.js");
}
catch {
	config = require("../default.config.js");
}

const definitions = [
	CheckIn,
	CodeRedeem,
	DailiesReminder,
	Expedition,
	MissedCheckIn,
	RealmCurrency,
	ShopStatus,
	Stamina,
	WeekliesReminder
];

const initCrons = () => {
	const crons = [];
	for (const definition of definitions) {
		const cron = {
			name: definition.name,
			description: definition.description,
			code: definition.code
		};

		const expression = config.crons[definition.name] || definition.expression;
		const job = new CronJob(expression, () => cron.code(cron));
		job.start();

		crons.job = job;
		crons.push(cron);
	}

	app.Logger.info("Cron", `Initialized ${crons.length} cron jobs`);
	return crons;
};

module.exports = {
	initCrons
};
