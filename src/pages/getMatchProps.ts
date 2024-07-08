import type { EventRowType } from "../components/EventRow";
import type { LeagueType } from "../components/Livetable";

const getMatchProps = async (url?: string) => {
  const response = await fetch("https://web-poc-astro.vercel.app/api/soccer");
  const data = (await response.json()) as {
    events: EventRowType[];
    leagues: LeagueType[];
  };

  const getPathParts = (url?: string) => {
    const idMatches = url?.match(
      /(?<basePath>zapas\/(?<id>\d+))\/?(?<rest>.*)/
    );

    if (idMatches && idMatches.groups?.id && idMatches.groups?.basePath) {
      return {
        id: idMatches.groups.id,
        basePath: idMatches.groups.basePath,
        rest: idMatches.groups.rest.length ? idMatches.groups.rest : null,
      };
    }

    return { id: null, basePath: null, rest: null };
  };

  const { id, basePath, rest } = getPathParts(url);

  const event = data.events.find((e) => e.id === Number(id));

  const league = data.leagues.find((l) => l.id === event?.leagueId);

  return { event, league, doNotIndex: rest !== null, basePath };
};

export default getMatchProps;
