import React, { useState } from "react";

import $myGames from "../store/myGames";

import type { PropsWithChildren } from "react";
import type { EventRowType } from "./EventRow";
const LeagueContext = React.createContext({
  hasLeagueIconHover: false,
  setLeagueIconHover: (value: boolean) => {},
  onLeagueIconClick: () => {},
});

const LeagueProvider = ({
  events,
  children,
}: PropsWithChildren & { events: EventRowType[] }) => {
  const [hasLeagueIconHover, setLeagueIconHover] = useState(false);
  const onLeagueIconClick = () => {
    const myGames = $myGames.get();

    const eventsInMyGames = events.filter((event) => myGames.has(event.id));

    if (eventsInMyGames.length > 0) {
      eventsInMyGames.forEach((event) => {
        myGames.delete(event.id);
      });
      setLeagueIconHover(false);
    } else {
      events.forEach((event) => {
        myGames.add(event.id);
      });
    }

    $myGames.set(new Set(myGames));
  };

  return (
    <LeagueContext.Provider
      value={{
        hasLeagueIconHover,
        setLeagueIconHover,
        onLeagueIconClick,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

function useLeagueAtom() {
  const context = React.useContext(LeagueContext);

  if (context === undefined) {
    throw new Error("useLeagueAtom must be used within a LeagueProvider");
  }

  return context;
}

export { LeagueProvider, useLeagueAtom };
