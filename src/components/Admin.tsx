import usePartySocket from "partysocket/react";

import AdminRow from "./AdminRow";

import type { EventRowType } from "./EventRow";

import type { FunctionComponent, PropsWithChildren } from "react";
interface AdminProps extends PropsWithChildren {
  events: EventRowType[];
}

const Admin: FunctionComponent<AdminProps> = ({ events }) => {
  const socket = usePartySocket({
    host: "https://web-poc-partykit.heyho-dev.partykit.dev",
    room: "livko",
  });

  return (
    <div className="flex flex-col gap-y-4">
      {events.map((event) => (
        <AdminRow key={event.id} {...event} socket={socket} />
      ))}
    </div>
  );
};

export default Admin;
