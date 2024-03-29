import { trpc } from "../../../utils/trpc";
import { getDriverName } from "../../../utils/getDriverName";
import intervalToDuration from "date-fns/intervalToDuration";

import styles from "../../../styles/DriverProfile.module.scss";

interface DriverProfileHeaderProps {
  driverID: string;
}

const DriverProfileHeader = (props: DriverProfileHeaderProps) => {
  const { data: description } = trpc.driver.getDescription.useQuery({
    driverID: props.driverID,
  });

  const age =
    intervalToDuration({
      start: description?.dateOfBirth ? new Date(description?.dateOfBirth) : new Date(),
      end: new Date(),
    }).years ?? 0;

  return (
    <div className={styles.description}>
      <h1 className={styles.title}>{getDriverName(description)}</h1>{" "}
      <h3 className={styles.subtitle}>{description?.nationality}</h3>
      <div>{`${description?.dateOfBirth} (${age} years)`}</div>
    </div>
  );
};

export default DriverProfileHeader;
