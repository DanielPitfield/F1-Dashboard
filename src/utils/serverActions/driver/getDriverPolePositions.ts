"use server";

import { BASE_API_URL, MAX_LIMIT } from "../../../data/CONSTANTS";
import type { Race } from "../../types/GrandPrix";

export async function getDriverPolePositions(config: { driverID: string }): Promise<{
  firstPole: Race;
  lastPole: Race;
  totalNum: number;
}> {
  const API_URL = `${BASE_API_URL}/drivers/${config.driverID}/qualifying/1.json?limit=${MAX_LIMIT}`;

  const response = await fetch(API_URL);
  const data = await response.json();

  return {
    firstPole: data.MRData.RaceTable.Races[0],
    lastPole: data.MRData.RaceTable.Races.at(-1),
    totalNum: parseInt(data.MRData.total),
  };
}
