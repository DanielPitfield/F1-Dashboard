import Link from "next/link";
import type { GrandPrixWeekend, Race } from "../../utils/types/GrandPrix";

interface GrandPrixLinkProps {
  grandPrix: GrandPrixWeekend | Race | undefined;
  showRaceName: boolean;
}

const GrandPrixLink = (props: GrandPrixLinkProps) => {
  if (!props.grandPrix) {
    return null;
  }

  const text = props.showRaceName ? `${props.grandPrix.season} ${props.grandPrix.raceName}` : props.grandPrix.season;

  return <Link href={`/grandPrixs/${props.grandPrix.season}/${props.grandPrix.round}`}>{text}</Link>;
};

export default GrandPrixLink;
