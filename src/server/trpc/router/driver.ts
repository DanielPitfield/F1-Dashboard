import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TeamInfo } from "./team";
import { MAX_LIMIT } from "../../../utils/limits";

export type DriverInfo = {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
};

export type DriverSeasonHistory = {
  season: string;
  round: string;
  DriverStandings: {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: DriverInfo;
    Constructors: TeamInfo[];
  }[];
};

// TODO: Team History
// TODO: First race (first win?)
// TODO: Most recent race (also most recent win?)
// TODO: Championship result history
// TODO: Is a current driver on the grid?
// TODO: Picture (F1 22 card?)

export const driverRouter = router({
  getInfo: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/drivers/${input.driverID}.json?limit=1`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return (await data.MRData.DriverTable.Drivers[0]) as DriverInfo;
    }),

  getChampionshipResults: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `https://ergast.com/api/f1/drivers/${input.driverID}/driverStandings.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return (await data.MRData.StandingsTable
        .StandingsLists) as DriverSeasonHistory[];
    }),

  getTeamsDrivenFor: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/drivers/${input.driverID}/constructors.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return (await data.MRData.ConstructorTable.Constructors) as TeamInfo[];
    }),

  getRacesEntered: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `https://ergast.com/api/f1/drivers/${input.driverID}/results.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races,
        totalNum: data.MRData.total as string,
      };
    }),

  getPolePositions: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/drivers/${input.driverID}/qualifying/1.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races,
        totalNum: data.MRData.total as string,
      };
    }),

  getRaceWins: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/drivers/${input.driverID}/results/1.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races,
        totalNum: data.MRData.total as string,
      };
    }),

  getFastestLaps: publicProcedure
    .input(z.object({ driverID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/drivers/${input.driverID}/fastest/1/results.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races,
        totalNum: data.MRData.total as string,
      };
    }),
});
