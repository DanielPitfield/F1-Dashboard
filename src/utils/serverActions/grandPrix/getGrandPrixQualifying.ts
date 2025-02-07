"use server";

import { BASE_API_URL, MAX_LIMIT } from "../../../data/CONSTANTS";
import type { Qualifying } from "../../types/GrandPrix";

export async function getGrandPrixQualifying(config: { season: string; roundNumber: string }): Promise<Qualifying> {
  const API_URL = `${BASE_API_URL}/${config.season}/${config.roundNumber}/qualifying.json?limit=${MAX_LIMIT}`;

  const response = await fetch(API_URL);
  const data = await response.json();

  return data?.MRData?.RaceTable?.Races?.[0];
}
