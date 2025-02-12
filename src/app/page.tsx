// Fresh data on each request (on demand instead of being pre-rendered)
export const dynamic = "force-dynamic";

import styles from "../styles/index.module.scss";

import Image from "next/image";
import BannerImage from "../../public/Images/Banner.png";
import UpcomingWeekendSummary from "../components/UpcomingWeekendSummary";
import SocialMediaButton from "../components/SocialMediaButton";
import { SocialMediaNames } from "../data/SocialMedia";
import { getUpcomingGrandPrixWeekend } from "../utils/serverActions/home/getUpcomingGrandPrixWeekend";

export default async function Page() {
  const upcomingGrandPrixWeekend = await getUpcomingGrandPrixWeekend();

  return (
    <section className={styles.wrapper}>
      <aside className={styles.navigation}>
        <div className={styles.titleWrapper}>
          <UpcomingWeekendSummary upcomingGrandPrixWeekend={upcomingGrandPrixWeekend} />

          <ul className={styles.list}>
            {SocialMediaNames.map((name) => (
              <SocialMediaButton key={name} name={name} />
            ))}
          </ul>
        </div>
      </aside>

      <div className={styles.imageWrapper}>
        <Image src={BannerImage} alt="Banner" priority fill />
      </div>
    </section>
  );
}
