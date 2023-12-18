import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import $myLeagues from "../store/myLeagues";

type MyLeaguesIconProps = {
  id: number;
};

const MyLeaguesIcon = ({ id }: MyLeaguesIconProps) => {
  const $myLeaguesStore = computed($myLeagues, (myLeagues) =>
    myLeagues.has(id)
  );

  const isMyLeagues = useStore($myLeaguesStore);

  return (
    <button
      className={`hover:opacity-75 ${
        isMyLeagues ? "opacity-100" : "opacity-25"
      }`}
      onClick={() => {
        const myLeagues = $myLeagues.get();

        if (myLeagues.has(id)) {
          myLeagues.delete(id);
        } else {
          myLeagues.add(id);
        }

        $myLeagues.set(new Set(myLeagues));
      }}
    >
      ⭐
    </button>
  );
};

export default MyLeaguesIcon;
