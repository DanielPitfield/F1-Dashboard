import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { MAX_LIMIT } from "../../../utils/limits";
import { DriverInfo } from "./driver";
import { RaceHistory, TeamStanding } from "./statistics";

export type TeamInfo = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
};

export type TeamSeasonHistory = {
  season: string;
  round: string;
  ConstructorStandings: TeamStanding[];
};

export const teamRouter = router({
  getInfo: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }): Promise<TeamInfo> => {
      const API_URL = `http://ergast.com/api/f1/constructors/${input.teamID}.json?limit=1`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return await data.MRData.ConstructorTable.Constructors[0];
    }),

  getDrivers: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const CURRENT_DRIVERS_API_URL = `http://ergast.com/api/f1/current/constructors/${input.teamID}/drivers.json`;
      const response_current = await fetch(CURRENT_DRIVERS_API_URL);
      const data_current = await response_current.json();

      const ALL_DRIVERS_API_URL = `http://ergast.com/api/f1/constructors/${input.teamID}/drivers.json?limit=${MAX_LIMIT}`;
      const response_all = await fetch(ALL_DRIVERS_API_URL);
      const data_all = await response_all.json();

      return {
        current: data_current.MRData.DriverTable.Drivers as DriverInfo[],
        all: data_all.MRData.DriverTable.Drivers as DriverInfo[],
      };
    }),

  getChampionshipResults: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const WINNING_YEARS_API_URL = `https://ergast.com/api/f1/constructors/${input.teamID}/constructorStandings/1.json?limit=${MAX_LIMIT}`;
      const response_winning = await fetch(WINNING_YEARS_API_URL);
      const data_winning = await response_winning.json();

      const ALL_YEARS_API_URL = `https://ergast.com/api/f1/constructors/${input.teamID}/constructorStandings.json?limit=${MAX_LIMIT}`;
      const response_all = await fetch(ALL_YEARS_API_URL);
      const data_all = await response_all.json();

      return {
        numChampionshipsWon: parseInt(data_winning.MRData.total),
        numChampionshipsEntered: parseInt(data_all.MRData.total),
        winningYears: data_winning.MRData.StandingsTable
          .StandingsLists as TeamSeasonHistory[],
        allYears: data_all.MRData.StandingsTable
          .StandingsLists as TeamSeasonHistory[],
      };
    }),

  getRacesEntered: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `https://ergast.com/api/f1/constructors/${input.teamID}/results.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races as RaceHistory[],
        totalNum: parseInt(data.MRData.total),
      };
    }),

  getPolePositions: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/constructors/${input.teamID}/qualifying/1.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races as RaceHistory[],
        totalNum: parseInt(data.MRData.total),
      };
    }),

  getRaceWins: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/constructors/${input.teamID}/results/1.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races as RaceHistory[],
        totalNum: parseInt(data.MRData.total),
      };
    }),

  getFastestLaps: publicProcedure
    .input(z.object({ teamID: z.string().min(1).trim() }))
    .query(async ({ input }) => {
      const API_URL = `http://ergast.com/api/f1/constructors/${input.teamID}/fastest/1/results.json?limit=${MAX_LIMIT}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      return {
        raceTable: data.MRData.RaceTable.Races as RaceHistory[],
        totalNum: parseInt(data.MRData.total),
      };
    }),
});
