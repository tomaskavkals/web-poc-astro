import { useStore } from "@nanostores/react";

import $myGames from "../store/myGames";

const MyGamesCounter = () => {
  const myGames = useStore($myGames);

  return (
    <div className="p-2 rounded-md text-sm bg-gray-900 text-white leading-3">
      {myGames.size}
    </div>
  );
};

export default MyGamesCounter;
