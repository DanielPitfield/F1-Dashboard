import { trpc } from "../../utils/trpc";
import CircuitLink from "../../components/Links/CircuitLink";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { REVALDATION_PERIOD } from "../../utils/limits";
import { Podium } from "../../components/Podium";
import DriverStandings from "../../components/Statistics/DriverStandings";
import TeamStandings from "../../components/Statistics/TeamStandings";
import QualifyingResults from "../../components/QualifyingResults";
import RaceResults from "../../components/RaceResults";
import SeasonLink from "../../components/Links/SeasonLink";

import styles from "../../styles/GrandPrixProfile.module.scss";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // TODO: Build time SSG
    paths: [
      { params: { grandPrix: ["2022", "3"] } },
      { params: { grandPrix: ["2022", "4"] } },
    ],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ grandPrix: string[] }>
) {
  // Helper function
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma },
    transformer: superjson,
  });

  // The dynamic parameter of the route (catch all route so this will always be an array)
  const grandPrix = context.params?.grandPrix as string[];
  // Destructure the season and roundNumber segments of the route
  const [seasonParam, roundNumberParam] = grandPrix;

  const season = seasonParam ?? "";
  const roundNumber = roundNumberParam ?? "";

  // Pre-fetching data (so that it is immediately available)
  await ssg.grandPrix.getSchedule.prefetch({
    season: season,
    roundNumber: roundNumber,
  });
  await ssg.grandPrix.getQualifying.prefetch({
    season: season,
    roundNumber: roundNumber,
  });
  await ssg.grandPrix.getRace.prefetch({
    season: season,
    roundNumber: roundNumber,
  });
  await ssg.grandPrix.getDriverStandingsAfter.prefetch({
    season: season,
    roundNumber: roundNumber,
  });
  await ssg.grandPrix.getTeamStandingsAfter.prefetch({
    season: season,
    roundNumber: roundNumber,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      season: season,
      roundNumber: roundNumber,
    },
    revalidate: REVALDATION_PERIOD,
  };
}

const GrandPrixProfile = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { data: schedule } = trpc.grandPrix.getSchedule.useQuery({
    season: props.season,
    roundNumber: props.roundNumber,
  });

  const { data: qualifying } = trpc.grandPrix.getQualifying.useQuery({
    season: props.season,
    roundNumber: props.roundNumber,
  });

  const { data: race } = trpc.grandPrix.getRace.useQuery({
    season: props.season,
    roundNumber: props.roundNumber,
  });

  const { data: driverStandings } =
    trpc.grandPrix.getDriverStandingsAfter.useQuery({
      season: props.season,
      roundNumber: props.roundNumber,
    });

  const { data: teamStandings } = trpc.grandPrix.getTeamStandingsAfter.useQuery(
    {
      season: props.season,
      roundNumber: props.roundNumber,
    }
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.description}>
        <h1 className={styles.title}>
          <SeasonLink season={schedule?.season} />
          {` ${schedule?.raceName}`}
        </h1>
        <h3 className={styles.subtitle}>
          <CircuitLink circuit={schedule?.Circuit} />
        </h3>
      </div>

      <div>{`Round ${schedule?.round}`}</div>
      <div>{`(${schedule?.date})`}</div>

      <Podium race={race} showTeams={true} showTimes={true} />

      <QualifyingResults
        qualifying={qualifying}
        showTeams={false}
        showTimes={true}
      />
      <RaceResults race={race} showTeams={false} showTimes={true} />

      <DriverStandings standings={driverStandings} />
      <TeamStandings standings={teamStandings} />
    </div>
  );
};

export default GrandPrixProfile;
