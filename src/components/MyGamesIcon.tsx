import classNames from "classnames";
import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import $myGames from "../store/myGames";
import { useLeagueAtom } from "./LeagueContext";

type MyGamesIconProps = {
  id: number;
};

const MyGamesIcon = ({ id }: MyGamesIconProps) => {
  const { hasLeagueIconHover } = useLeagueAtom();
  const $myGamesStore = computed($myGames, (myGames) => myGames.has(id));

  const isMyGames = useStore($myGamesStore);

  return (
    <button
      className={classNames(
        hasLeagueIconHover
          ? "opacity-75"
          : isMyGames
          ? "opacity-100"
          : "opacity-25",
        "hover:opacity-75"
      )}
      onClick={() => {
        const myGames = $myGames.get();

        if (myGames.has(id)) {
          myGames.delete(id);
        } else {
          myGames.add(id);
        }

        $myGames.set(new Set(myGames));
      }}
    >
      ⭐
    </button>
  );
};

export default MyGamesIcon;
