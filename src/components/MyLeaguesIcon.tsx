import classNames from "classnames";
import { computed } from "nanostores";

import { useStore } from "@nanostores/react";

import { useLeagueAtom } from "./LeagueContext";

type MyLeaguesIconProps = {
  id: number;
};

const MyLeaguesIcon = ({ id }: MyLeaguesIconProps) => {
  const { hasLeagueIconHover, setLeagueIconHover, onLeagueIconClick } =
    useLeagueAtom();

  return (
    <button
      className={classNames(
        "hover:opacity-75"
        //isMyLeagues ? "opacity-100" : "opacity-25"
      )}
      onMouseEnter={() => setLeagueIconHover(true)}
      onMouseLeave={() => setLeagueIconHover(false)}
      onClick={() => onLeagueIconClick()}
    >
      ⭐
    </button>
  );
};

export default MyLeaguesIcon;
