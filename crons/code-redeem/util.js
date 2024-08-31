const CodeResolver = require("./resolvers/index.js");
const REDEMPTION_LINKS = {
	genshin: "https://genshin.hoyoverse.com/en/gift",
	starrail: "https://hsr.hoyoverse.com/gift",
	nap: "https://zenless.hoyoverse.com/redemption"
};

const fetchCodes = async (accountData) => {
	const { genshin, starrail, zenless } = await CodeResolver.fetchAll(accountData);
	if (starrail.length === 0 && genshin.length === 0 && zenless.length === 0) {
		return false;
	}

	return { genshin, starrail, zenless };
};

const redeemGenshin = async (account, codeData) => {
	const { success, failed } = await CodeResolver.redeemGenshin(account, codeData);
	return { success, failed };
};

const redeemStarRail = async (account, codeData) => {
	const { success, failed } = await CodeResolver.redeemStarRail(account, codeData);
	return { success, failed };
};

const redeemZenless = async (account, codeData) => {
	const { success, failed } = await CodeResolver.redeemZenless(account, codeData);
	return { success, failed };
};

const buildMessage = (status, account, code) => {
	const gameName = account.game.name;
	const messageTitle = status ? "Code Successfully Redeemed!" : `Code Redeem Failed! (${code.reason})`;
	const redeemLink = `${REDEMPTION_LINKS[account.platform]}?code=${code.code}`;

	const message = [
		`[${gameName}] (${account.uid}) ${account.nickname}`,
		`\n${messageTitle}`,
		`\nCode: ${code.code}`,
		...(status === false ? [`Manually Redeem Here: ${redeemLink}`] : []),
		...(status === true ? [`Rewards: ${code.rewards.join(", ")}`] : [])
	].join("\n");

	const embed = {
		color: account.assets.color,
		title: `${gameName} Code Redeem`,
		author: {
			name: account.assets.author,
			icon_url: account.assets.logo
		},
		description: `(${account.uid}) ${account.nickname}`
		+ `\n${messageTitle}`
		+ `\nCode: ${code.code}`
		+ `${status === false ? `\nManually Redeem Here: ${redeemLink}` : ""}`
		+ `${status === true ? `\nRewards: ${code.rewards.join(", ")}` : ""}`,
		timestamp: new Date(),
		footer: {
			text: `${code.code}`,
			icon_url: account.assets.logo
		}
	};

	return {
		telegram: message,
		embed
	};
};

module.exports = {
	fetchCodes,
	redeemGenshin,
	redeemStarRail,
	redeemZenless,
	buildMessage
};
