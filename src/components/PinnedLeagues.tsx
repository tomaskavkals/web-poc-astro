import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import $pinnedLeagues from "../store/pinnedLeagues";

import type { LeagueType } from "./Livetable";

type PinnedLeaguesProps = {
  leagues: LeagueType[];
};

const PinnedLeagues = ({ leagues }: PinnedLeaguesProps) => {
  const pinnedLeagues = useStore($pinnedLeagues);

  return (
    <div className="flex flex-col gap-y-2">
      {Array.from(pinnedLeagues).map((leagueId) => (
        <div className="w-full group" key={leagueId}>
          <strong>{leagues.find((l) => l.id === leagueId)?.name}</strong>
          <button
            className="opacity-0 group-hover:opacity-100"
            onClick={() => {
              const pinnedLeagues = $pinnedLeagues.get();
              pinnedLeagues.delete(leagueId);
              $pinnedLeagues.set(new Set(pinnedLeagues));
            }}
          >
            📌
          </button>
        </div>
      ))}
    </div>
  );
};

export default PinnedLeagues;
