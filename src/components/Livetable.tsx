import Cookie from "js-cookie";
import usePartySocket from "partysocket/react";
import { useState } from "react";

import { useStore } from "@nanostores/react";

import { $events } from "../store/events";
import $pinnedLeagues from "../store/pinnedLeagues";
import League from "./League";

import type { EventRowType } from "./EventRow";

import type { FunctionComponent } from "react";

export type LeagueType = {
  id: number;
  name: string;
  round: number;
  season: string;
};

type LivetableProps = {
  events: EventRowType[];
  leagues: LeagueType[];
};

const getGroupedEventsIntoLeagues = (
  events: EventRowType[],
  pinned: Set<number>,
  sortBy: "league" | "time"
) => {
  if (sortBy === "time") {
    const leagues: Map<string, EventRowType[]> = new Map();
    const sortedEventsByTime = [...events].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    sortedEventsByTime.forEach((event) => {
      const leagueKey = `${event.leagueId}-${event.startTime.getTime()}`;

      if (!leagues.has(leagueKey)) {
        leagues.set(leagueKey, []);
      }

      leagues.get(leagueKey)?.push(event);
    });

    return leagues;
  }

  const pinnedLeagues: Map<number, EventRowType[]> = new Map();
  const leagues: Map<number, EventRowType[]> = new Map();

  events.forEach((event) => {
    const leagueKey = event.leagueId;

    const category = pinned.has(leagueKey) ? pinnedLeagues : leagues;

    if (!category.has(leagueKey)) {
      category.set(leagueKey, []);
    }

    category.get(leagueKey)?.push(event);
  });

  const finalLeagues = new Map([...pinnedLeagues, ...leagues]);

  [...finalLeagues.keys()].forEach((leagueId) => {
    finalLeagues
      .get(Number(leagueId))
      ?.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  });

  return finalLeagues;
};

const Livetable: FunctionComponent<LivetableProps> = ({ leagues, events }) => {
  const [sortBy, setSortBy] = useState<"league" | "time">("league");
  const pinnedLeagues = useStore($pinnedLeagues);
  const groupedEventsIntoLeagues = getGroupedEventsIntoLeagues(
    events,
    pinnedLeagues,
    sortBy
  );
  const socket = usePartySocket({
    host: "https://web-poc-partykit.heyho-dev.partykit.dev",
    room: "livko",
    onMessage(event) {
      const message = JSON.parse(event.data);

      $events.set([
        ...$events.get().filter((e) => e.id !== message.eventId),
        {
          id: message.eventId,
          time: message.time,
          homeGoals: message.homeGoals,
          awayGoals: message.awayGoals,
        },
      ]);
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <button
        className="px-4 py-2 mr-auto text-white bg-gray-900 rounded-md shadow-md"
        onClick={() => {
          Cookie.set("personalized-view", "1", {
            expires: 365,
          });
          setSortBy(sortBy === "league" ? "time" : "league");
        }}
      >
        Sort by {sortBy === "league" ? "time" : "league"}
      </button>
      {[...groupedEventsIntoLeagues.keys()].map((leagueKey) => {
        const leagueEvents = groupedEventsIntoLeagues.get(leagueKey);

        if (!leagueEvents) {
          return null;
        }

        const league = leagues.find((l) => l.id === leagueEvents[0].leagueId);

        if (!league) {
          return null;
        }

        return (
          <League
            events={leagueEvents}
            sortBy={sortBy}
            socket={socket}
            leagueKey={leagueKey}
            key={leagueKey}
            {...league}
          />
        );
      })}
    </div>
  );
};

export default Livetable;
