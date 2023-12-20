export default class BBCodeValidator {
	/*
		This Regexp matches any BBCode opening tag

		(
			\[ -> opening bracket
			(?!br|hr|embed|image|video) -> not br, hr, embed, image, video
			[a-z0-9]+ -> tag name (only lowercase letters and numbers)
		)

		For better explanation try to paste this into https://regex101.com/
	*/
	private static openingTagRegexp = /(\[(?!br|hr|embed|image|video)[a-z0-9]+)/gim;

	/*
		This Regexp matches any BBCode closing tag

		\[ -> opening bracket
		\/ -> backslash
		[a-z0-9]+ -> tag name (only lowercase letters and numbers)
		\] -> opening bracket

		For better explanation try to paste this into https://regex101.com/
	*/
	private static closingTagRegexp = /\[\/[a-z0-9]+\]/gim;

	private static isEveryOpenedTagClosed = (source: string) => {
		const opened = source.match(BBCodeValidator.openingTagRegexp) || [];
		const closed = source.match(BBCodeValidator.closingTagRegexp) || [];

		return closed?.length === opened?.length;
	};

	static validate = (source: string) => {
		return this.isEveryOpenedTagClosed(source);
	};
}
