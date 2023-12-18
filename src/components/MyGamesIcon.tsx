import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import $myGames from "../store/myGames";

type MyGamesIconProps = {
  id: number;
};

const MyGamesIcon = ({ id }: MyGamesIconProps) => {
  const $myGamesStore = computed($myGames, (myGames) => myGames.has(id));

  const isMyGames = useStore($myGamesStore);

  return (
    <button
      className={`hover:opacity-75 ${isMyGames ? "opacity-100" : "opacity-25"}`}
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
