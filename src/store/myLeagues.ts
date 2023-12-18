import { persistentAtom } from "@nanostores/persistent";

const $myLeagues = persistentAtom<Set<number>>("myLeagues", new Set(), {
  encode: (value: Set<number>) => JSON.stringify(Array.from(value)),
  decode: (value: string) => new Set(JSON.parse(value)),
});

export default $myLeagues;
