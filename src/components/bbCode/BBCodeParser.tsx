import React from "react";

import Link from "./BBCodeComponents/Link";
import BBCodeRepairer from "./BBCodeRepairer";
import BBCodeValidator from "./BBCodeValidator";

export type BBCodeComponentType = (
  props: any,
  children?: React.ReactNode[] | string | null
) => React.ReactNode;

type BBCodeParserOptions = {
  validate?: boolean;
  overrides?: Record<
    string,
    BBCodeComponentType | Record<string, BBCodeComponentType>
  >;
};

export default class BBCodeParser {
  /*
		This Regexp matches any BBCode pair or single tag

		Pair tag
			\[ -> opening bracket
			(
				?<pairTag>(?!br|hr|embed|image|video)[a-z0-9\-/]* -> tag name (only lowercase letters and numbers) except [br], [hr], [embed...], [video...] and [image] and stored in pairTag group
			)
			? -> space (optional)
			[^\]]* -> any character except ]
			\] -> closing bracket of opening tag
			.*? -> any character (content inside pair tag)
			\[ -> opening bracket of closing tag
			\/ -> backslash
			\1 -> tag that was matched in pairTag group
			\] -> closing bracket of closing tag
		| -> or

		Single tag
			\[ -> opening bracket
			(
				?<singleTag>br|hr|embed|image|video* -> tag name (only br, hr, embed, video or image) and stored in singleTag group
			)
			[^\]]* -> any character except ]
			\]* -> closing bracket
			 ? -> space (optional)
			\/? -> backslash (optional)
			\] -> closing bracket

		Examples:
			- [p]Example test[/p] -> Group pairTag is p
			- [br] -> Group singleTag is br


		For better explanation try to paste this into https://regex101.com/
	*/
  private static tagRegexp =
    /\[(?<pairTag>(?!br|hr|embed|image|video)[a-z0-9\-/]*) ?[^\]]*\].*?\[\/\1\]|\[(?<singleTag>br|hr|embed|image|video*)[^\]]*\]* ?\/?\]/i;

  /*
		This Regexp checks if tag contains attributes

		^[^\]]* -> any character except ]
		(
			[a-z0-9-]* -> attribute name (only lowercase letters and numbers and -)
		)
		= -> equal sign because name=value
		(
			['|"] -> single or double quote
		)
		(
			(?:(?!\2). -> any character except second single or double quote (depends on previous match)
		)+

		Examples:
			- [embed attrName="attrValue"] -> Match

		For better explanation try to paste this into https://regex101.com/
	*/
  private static hasAttrsRegexp = /^[^\]]*([a-z0-9-]*)=(['|"])((?:(?!\2).)+)/i;

  /*
		This Regexp extracts attributes

		(
			?<name>[a-z0-9-]*> attribute name (only lowercase letters and numbers and -) stored in name group
		)
		= -> equal sign because name=value
		(
			['|"] -> single or double quote
		)
		(
			?<value>(
				?:(?!\2). -> any character except second single or double quote (depends on previous match)
			)+ -> value of attribute stored in value group
		)

		Examples:
			- [embed attrName="attrValue"] -> Group name is attrName and group value is attrValue

		For better explanation try to paste this into https://regex101.com/
	*/
  private static tagAttrsRegexp =
    /(?<name>[a-z0-9-]*)=(['|"])(?<value>(?:(?!\2).)+)/i;

  /*
		This Regexp extracts content

		\[ -> opening bracket
		(
			[a-z0-9-]* -> tag name (only lowercase letter, numbers and dash)
		)
		 ? -> space (optional)
		[^\]]* -> any character except ]
		\] -> closing bracket
		(
			?<content>.*? -> content of tag stored in content group
		)
		\[ -> opening bracket of closing tag
		\/ -> backslash
		\1 -> tag that was matched in opening bracket
		\] -> closing bracket of closing tag

		Examples:
			- [p]Content[/p] -> Group content is Content

		For better explanation try to paste this into https://regex101.com/
	*/
  private static tagContentRegexp =
    /\[([a-z0-9-]*) ?[^\]]*\](?<content>.*?)\[\/\1\]/i;

  /*
		This Regexp matches every BBCode tag

		\[ -> opening bracket
		\/? -> backslash (optional)
		[a-z0-9-]+ -> tag name (only lowercase letters, numbers and dash)
		\] -> closing bracket

		Examples:
			- [p]Content[/p] -> Match is [p]

		For better explanation try to paste this into https://regex101.com/
	*/
  private static everyTagRegexp = /\[\/?[a-z0-9-]+\]/gim;
  private static splitter = "|@|";
  private static divider = "__DIVIDER__";
  private components: Record<string, BBCodeComponentType> = {
    url: (props, children) => (
      <Link {...props} target="_blank">
        {children}
      </Link>
    ),
  };

  private validate: boolean;

  constructor({ validate = true, overrides = {} }: BBCodeParserOptions = {}) {
    const { embed = {}, ...restOfOverrides } = overrides;

    this.validate = validate;
    this.components = {
      ...this.components,
      ...(restOfOverrides as Record<string, BBCodeComponentType>),
    };
  }

  private static escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  private static parseTags = (content: string) =>
    content.match(new RegExp(BBCodeParser.tagRegexp, "g")) || [];

  private static parseAttrs = (source: string) => {
    const attrs: Record<string, string> = {};

    if (source.match(new RegExp(BBCodeParser.hasAttrsRegexp, "g")) === null) {
      return attrs;
    }

    source
      .match(new RegExp(BBCodeParser.tagAttrsRegexp, "g"))
      ?.forEach((attr) => {
        const match = BBCodeParser.tagAttrsRegexp.exec(attr);

        if (!match || !match.groups) {
          return;
        }

        attrs[match.groups?.name] = match.groups.value;
      });

    return attrs;
  };

  private static parseContent = (source: string) => {
    const match = BBCodeParser.tagContentRegexp.exec(source);

    if (!match || !match.groups) {
      return null;
    }

    return match.groups.content;
  };

  private static parseTag = (source: string) => {
    const result = BBCodeParser.tagRegexp.exec(source);

    if (
      result === null ||
      typeof result.groups === "undefined" ||
      (result.groups.pairTag === undefined &&
        result.groups.singleTag === undefined)
    ) {
      return { tag: null, props: {}, content: null };
    }

    const { groups = {} } = result;
    const content = BBCodeParser.parseContent(source);

    return {
      tag: groups.pairTag || groups.singleTag,
      props: BBCodeParser.parseAttrs(source),
      content,
    };
  };

  private getChildren = (keys: string[], source?: string | null) => {
    if (!source) {
      return null;
    }

    const tags = BBCodeParser.parseTags(source);

    if (tags.length === 0) {
      return source;
    }

    const processed = this.processSource(source, keys);

    if (typeof processed === "string") {
      return processed;
    }

    return source
      .replace(
        new RegExp(
          tags.map((tag) => `(${BBCodeParser.escapeRegExp(tag)})`).join("|"),
          "gm"
        ),
        `${BBCodeParser.splitter}${BBCodeParser.divider}${BBCodeParser.splitter}`
      )
      .split(BBCodeParser.splitter)
      .map((item) => {
        if (item === BBCodeParser.divider) {
          return processed.shift();
        }

        return item.replace(BBCodeParser.everyTagRegexp, "");
      });
  };

  private getComponent = (
    tag: string | null,
    props: Record<string, any> = {},
    children?: React.ReactNode[] | string | null
  ) => {
    if (tag && tag in this.components) {
      return this.components[tag](props, children);
    }

    return React.createElement(tag || React.Fragment, props, children);
  };

  private convertTag = (
    source: string,
    keys: string[]
  ): React.ReactNode | null => {
    const { tag, props, content } = BBCodeParser.parseTag(source);
    const children = this.getChildren(keys, content);

    return this.getComponent(
      tag,
      { ...(props || {}), key: keys.join("-") },
      children
    );
  };

  private processSource = (source: string, keys: string[]) => {
    const tags = BBCodeParser.parseTags(source);

    if (tags.length === 0) {
      return source;
    }

    return tags.map((tag, index) =>
      this.convertTag(tag, [...keys, index.toString()])
    );
  };

  private static replaceEntities = (source: string) => {
    const htmlEntities = {
      "&gt;": "\u003E",
      "&lt;": "\u003C",
      "&amp;": "\u0026",
      "&hellip;": "\u2026",
      "&nbsp;": "\u00A0",
      "&rsaquo;": "\u203A",
      "&lsaquo;": "\u2039",
    };

    return source.replace(/(&[a-z0-9]*;)/gim, (value) => {
      const entity = htmlEntities[value as keyof typeof htmlEntities];

      if (entity) {
        return entity;
      }

      if (typeof window === "undefined") {
        return value;
      }

      console.error(`Unknown HTML Entity "${value}"`);

      const fallbackEl = document.createElement("textarea");
      fallbackEl.innerHTML = value;
      return fallbackEl.value;
    });
  };

  parse = (source: string, keyPrefix?: string) => {
    const repairedSource = BBCodeRepairer.repair(source);

    if (this.validate && !BBCodeValidator.validate(repairedSource)) {
      console.error(`Invalid BBCode: ${repairedSource}`);
    }

    return this.processSource(
      BBCodeParser.replaceEntities(repairedSource),
      keyPrefix ? [keyPrefix] : []
    );
  };
}
