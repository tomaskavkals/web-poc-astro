import { persistentAtom } from "@nanostores/persistent";

const $pinnedLeagues = persistentAtom<Set<number>>("pinnedLeagues", new Set(), {
  encode: (value: Set<number>) => JSON.stringify(Array.from(value)),
  decode: (value: string) => new Set(JSON.parse(value)),
});

export default $pinnedLeagues;
