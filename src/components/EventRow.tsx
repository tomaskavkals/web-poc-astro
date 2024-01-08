import { computed } from "nanostores";
import { useEffect, useRef, useState } from "react";

import { useStore } from "@nanostores/react";

import { $events } from "../store/events";
import MyGamesIcon from "./MyGamesIcon";

import type { FunctionComponent } from "react";
import type PartySocket from "partysocket";
export type EventRowType = {
  id: number;
  home: string;
  away: string;
  startTime: Date;
  leagueId: number;
};

const EventRow: FunctionComponent<EventRowType & { socket: PartySocket }> = ({
  id,
  home,
  away,
  startTime,
  socket,
}) => {
  const $rowStore = computed($events, (events) =>
    events.find((event) => event.id === id)
  );
  const ref = useRef<HTMLAnchorElement>(null);
  const [state, setState] = useState<{
    startTime: string | null;
    isHydrated: boolean;
  }>({
    isHydrated: false,
    startTime: null,
  });
  const liveData = useStore($rowStore);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        setState({
          isHydrated: true,
          startTime: startTime.toLocaleTimeString("cs").replace(/:00$/, ""),
        });

        socket.send(JSON.stringify({ type: "sync", eventId: id }));

        observer.disconnect();
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <a href={`/zapas/${id}`} ref={ref} className="flex flex-row">
      <div className="w-1/12 text-center">
        {state.isHydrated && <MyGamesIcon id={id} />}
      </div>
      <div className="w-1/12 text-center">
        {liveData && liveData.time > 0 ? (
          <strong className="text-red-500">{liveData.time}'</strong>
        ) : (
          state.startTime
        )}
      </div>
      <h3 className="w-5/12">
        <strong>{home}</strong> - <strong>{away}</strong>
      </h3>
      {liveData && (
        <div className="w-5/12">
          {liveData.homeGoals} - {liveData.awayGoals}
        </div>
      )}
    </a>
  );
};

export default EventRow;
