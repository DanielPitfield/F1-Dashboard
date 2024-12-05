"use server";

import { MAX_LIMIT } from "../../../data/limits";
import { filterPodiums } from "../../filterPodiums";
import { Race } from "../../types/GrandPrix";

export async function getDriverRaces(config: { driverID: string }): Promise<{
  numRacesEntered: number;
  numPodiums: number;
  numWins: number;
  firstRace: Race | undefined;
  lastRace: Race | undefined;
  firstWin: Race | undefined;
  lastWin: Race | undefined;
}> {
  const API_URL = `https://ergast.com/api/f1/drivers/${config.driverID}/results.json?limit=${MAX_LIMIT}`;

  const response = await fetch(API_URL);
  const data = await response.json();

  // Every race the driver has participated in
  const allRaces: Race[] = data.MRData.RaceTable.Races;

  const winningRaces: Race[] = allRaces.filter((race) => {
    // What position did the driver in question finish for the race?
    const finishingPosition: string =
      race.Results.find((result) => result.Driver.driverId === config.driverID)?.position ?? "";
    // Did they win the race?
    return finishingPosition === "1";
  });

  return {
    numRacesEntered: parseInt(data.MRData.total),
    numPodiums: filterPodiums(allRaces).length,
    numWins: winningRaces.length,
    firstRace: allRaces[0],
    lastRace: allRaces.at(-1),
    firstWin: winningRaces[0],
    lastWin: winningRaces.at(-1),
  };
}