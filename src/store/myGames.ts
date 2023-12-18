import { persistentAtom } from "@nanostores/persistent";

const $myGames = persistentAtom<Set<number>>("myGames", new Set(), {
  encode: (value: Set<number>) => JSON.stringify(Array.from(value)),
  decode: (value: string) => new Set(JSON.parse(value)),
});

export default $myGames;
