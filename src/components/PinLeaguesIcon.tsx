import Cookie from "js-cookie";
import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import $pinnedLeagues from "../store/pinnedLeagues";

type PinnedLeaguesIconProps = {
  id: number;
};

const PinnedLeaguesIcon = ({ id }: PinnedLeaguesIconProps) => {
  const $pinnedLeaguesStore = computed($pinnedLeagues, (pinnedLeagues) =>
    pinnedLeagues.has(id)
  );

  const isPinnedLeagues = useStore($pinnedLeaguesStore);

  return (
    <button
      className={`hover:opacity-75 ${
        isPinnedLeagues ? "opacity-100" : "opacity-25"
      }`}
      onClick={() => {
        Cookie.set("personalized-view", "1", {
          expires: 365,
        });

        const pinnedLeagues = $pinnedLeagues.get();

        if (pinnedLeagues.has(id)) {
          pinnedLeagues.delete(id);
        } else {
          pinnedLeagues.add(id);
        }

        $pinnedLeagues.set(new Set(pinnedLeagues));
      }}
    >
      📌
    </button>
  );
};

export default PinnedLeaguesIcon;
