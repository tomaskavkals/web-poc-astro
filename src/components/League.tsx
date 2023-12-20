import type PartySocket from "partysocket";
import type { LeagueType } from "./Livetable";
import type { EventRowType } from "./EventRow";

import EventRow from "./EventRow";
import { LeagueProvider } from "./LeagueContext";
import LeagueHeader from "./LeagueHeader";

interface LeagueProps extends LeagueType {
  leagueKey: number | string;
  sortBy: "league" | "time";
  events: EventRowType[];
  socket: PartySocket;
}

const League = ({
  name,
  leagueKey,
  id,
  sortBy,
  events,
  socket,
}: LeagueProps) => {
  return (
    <div
      key={`${leagueKey}-${sortBy}`}
      className="bg-white rounded-lg px-4 py-2 shadow-sm"
    >
      <LeagueProvider events={events}>
        <LeagueHeader id={id} name={name} />
        <div className="flex flex-col gap-y-2">
          {events.map((event) => (
            <EventRow key={event.id} {...event} socket={socket} />
          ))}
        </div>
      </LeagueProvider>
    </div>
  );
};

export default League;
