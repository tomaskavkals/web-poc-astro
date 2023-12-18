import { useState } from "react";

import type { FunctionComponent } from "react";

import type { EventRowType } from "./EventRow";
import type PartySocket from "partysocket";

const AdminRow: FunctionComponent<EventRowType & { socket: PartySocket }> = ({
  id,
  home,
  away,
  socket,
}) => {
  const [state, setState] = useState<{ homeGoals: number; awayGoals: number }>({
    homeGoals: 0,
    awayGoals: 0,
  });

  return (
    <div>
      <div>#{id}</div>
      <div>
        {home} - {away}
      </div>
      <input
        type="number"
        defaultValue={0}
        min="0"
        max="90"
        name="time"
        onChange={(ev) =>
          socket.send(
            JSON.stringify({
              type: "time",
              eventId: id,
              value: ev.target.value,
            })
          )
        }
      />
      <button
        type="button"
        onClick={() => {
          socket.send(
            JSON.stringify({
              type: "homeGoals",
              eventId: id,
              value: state.homeGoals + 1,
            })
          );

          setState((prev) => ({ ...prev, homeGoals: prev.homeGoals + 1 }));
        }}
      >
        Goal home ({state.homeGoals})
      </button>
      <button
        type="button"
        onClick={() => {
          socket.send(
            JSON.stringify({
              type: "awayGoals",
              eventId: id,
              value: state.awayGoals + 1,
            })
          );

          setState((prev) => ({ ...prev, awayGoals: prev.awayGoals + 1 }));
        }}
      >
        Goal away ({state.awayGoals})
      </button>
    </div>
  );
};

export default AdminRow;
