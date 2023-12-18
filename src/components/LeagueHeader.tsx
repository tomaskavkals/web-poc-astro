import type { LeagueType } from "./Livetable";
import MyLeaguesIcon from "./MyLeaguesIcon";
import PinnedLeaguesIcon from "./PinLeaguesIcon";

type LeagueHeaderProps = {
  id: number;
  leagues: LeagueType[];
};

const LeagueHeader = ({ id, leagues }: LeagueHeaderProps) => {
  return (
    <h2 className="text-lg font-bold mb-4 border-b-[1px] pb-2 border-gray-200 flex flex-row gap-x-2 items-center">
      <MyLeaguesIcon id={id} />
      {leagues.find((l) => l.id === id)?.name}
      <PinnedLeaguesIcon id={id} />
    </h2>
  );
};

export default LeagueHeader;
