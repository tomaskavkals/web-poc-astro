import usePartySocket from "partysocket/react";
import { useState } from "react";

import { $events } from "../store/events";
import EventRow from "./EventRow";

import type { EventRowType } from "./EventRow";

import type { FunctionComponent, PropsWithChildren } from "react";
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
  sortBy: "league" | "time"
) => {
  const leagues: Record<string, EventRowType[]> = {};

  if (sortBy === "time") {
    const sortedEventsByTime = [...events].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    sortedEventsByTime.forEach((event) => {
      const leagueKey = `${event.leagueId}-${event.startTime.getTime()}`;

      if (typeof leagues[leagueKey] === "undefined") {
        leagues[leagueKey] = [];
      }

      leagues[leagueKey].push(event);
    });

    return leagues;
  }

  events.forEach((event) => {
    const leagueKey = event.leagueId;

    if (typeof leagues[leagueKey] === "undefined") {
      leagues[leagueKey] = [];
    }

    leagues[leagueKey].push(event);
  });

  Object.keys(leagues).forEach((leagueId) => {
    leagues[leagueId].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
  });

  return leagues;
};

const Livetable: FunctionComponent<LivetableProps> = ({ leagues, events }) => {
  const [sortBy, setSortBy] = useState<"league" | "time">("league");
  const groupedEventsIntoLeagues = getGroupedEventsIntoLeagues(events, sortBy);
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
        className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-md mr-auto"
        onClick={() => setSortBy(sortBy === "league" ? "time" : "league")}
      >
        Sort by {sortBy === "league" ? "time" : "league"}
      </button>
      {Object.keys(groupedEventsIntoLeagues).map((leagueId) => (
        <div key={leagueId} className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <h2 className="text-lg font-bold mb-4 border-b-[1px] pb-2 border-gray-200">
            {
              leagues.find(
                (l) => l.id === groupedEventsIntoLeagues[leagueId][0].leagueId
              )?.name
            }
          </h2>
          <div className="flex flex-col gap-y-2">
            {groupedEventsIntoLeagues[leagueId].map((event) => (
              <EventRow key={event.id} {...event} socket={socket} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Livetable;
