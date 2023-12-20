export default class BBCodeRepairer {
	static embedOrImageInParagraph = /\[p\](?<content>\[(embed|image|video*)[^\]]*\]* ?\/?\]*)\[\/p\]/gim;

	private static repairEmbedOrImageInParagraph = (source: string) => {
		const matches = source.match(BBCodeRepairer.embedOrImageInParagraph) || [];

		let repairedSource = source;

		matches.forEach((match) => {
			const repairedMatch = match
				.replace(/^\[p\]/, "") // Removes opening tag
				.replace(/\[\/p\]$/, ""); // Removes closing tag
			repairedSource = repairedSource.replace(match, repairedMatch);
		});

		return repairedSource;
	};

	static repair = (source: string) => {
		return this.repairEmbedOrImageInParagraph(source);
	};
}
