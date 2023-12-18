import { atom } from "nanostores";

export const $events = atom<
  {
    id: number;
    time: number;
    homeGoals: number;
    awayGoals: number;
  }[]
>([]);
