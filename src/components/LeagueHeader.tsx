import MyLeaguesIcon from "./MyLeaguesIcon";
import PinnedLeaguesIcon from "./PinLeaguesIcon";

type LeagueHeaderProps = {
  id: number;
  name: string;
};

const LeagueHeader = ({ id, name }: LeagueHeaderProps) => {
  return (
    <h2 className="text-lg font-bold mb-4 border-b-[1px] pb-2 border-gray-200 flex flex-row gap-x-2 items-center">
      <MyLeaguesIcon id={id} />
      {name}
      <PinnedLeaguesIcon id={id} />
    </h2>
  );
};

export default LeagueHeader;
