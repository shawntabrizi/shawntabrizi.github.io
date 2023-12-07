import React from "react";
import RawData from "./github-repo-info.json";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import PortfolioCard from "../../components/PortfolioCard";

function sort_by_stars(a, b) {
  return b.stars - a.stars;
}
let sorted_data = RawData.sort(sort_by_stars);

function Repository(props) {
  return (
    <div className="col col--4">
      <PortfolioCard {...props} />
    </div>
  );
}

function Repositories() {
  return (
    <section className={styles.donations}>
      <div className="container">
        <div className="row">
          {sorted_data
            .filter((a) => a.fork == false)
            .map((props, idx) => (
              <Repository key={idx} {...props} />
            ))}
        </div>
        <Heading as="h1">Contributing To:</Heading>
        <div className="row">
          {sorted_data
            .filter((a) => a.fork == true)
            .map((props, idx) => (
              <Repository key={idx} {...props} />
            ))}
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Portfolio`}
      description={`Portfolio of ${siteConfig.title}.`}
    >
      <main>
        <Repositories />
      </main>
    </Layout>
  );
}
