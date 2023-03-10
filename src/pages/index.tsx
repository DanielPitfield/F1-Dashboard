import type { NextPage } from "next";
import Head from "next/head";
import TwitterProfileTimeline from "../components/TwitterProfileTimeline";
import UpcomingWeekendSummary from "../components/UpcomingWeekendSummary";

import styles from "../styles/index.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>F1 Dashboard</title>
        <meta
          name="description"
          content="F1 Statistics, Schedule and Information"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <UpcomingWeekendSummary />
          <TwitterProfileTimeline profileName="F1" isDarkMode />
        </div>
      </div>
    </>
  );
};

export default Home;
