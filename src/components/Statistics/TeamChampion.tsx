import { TeamSeasonHistory } from "../../server/trpc/router/team";

import styles from "../../styles/statistics/TeamChampion.module.scss";

interface WorldChampionshipStatisticProps {
  championshipsWon: TeamSeasonHistory[];
}

const TeamChampion = (props: WorldChampionshipStatisticProps) => {
  const teamName = props.championshipsWon[0]?.ConstructorStandings.Constructor.name;

  return (
    <div key={teamName} className={styles.wrapper}>
      <div className={styles.name}>{teamName}</div>
      <div className={styles.numChampionships}>
        {props.championshipsWon.length}
      </div>
      <div className={styles.winningYears}>
        {`(${props.championshipsWon.map((x) => x.season).join(", ")})`}
      </div>
    </div>
  );
};

export default TeamChampion;
