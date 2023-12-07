import React from "react";
import RawData from "./github-repo-info.json";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork, faStar } from "@fortawesome/free-solid-svg-icons";
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

    /* <img
				alt="Repository Screenshot"
				src={`${html_url}/blob/master/screenshot.png?raw=true`}
				width="100%"
			/>
			<CardBody>
				<Row>
					<Col>{language}</Col>
					<Col><FontAwesomeIcon icon={faStar} />{stars}</Col>
					<Col><FontAwesomeIcon icon={faCodeFork} />{forksCount}</Col>
				</Row>
				<CardTitle tag="h5">
					{name.replace(/-/g, ' ').toUpperCase()}
				</CardTitle>
				<CardSubtitle
					className="mb-2 text-muted"
					tag="h6"
				>
					Card subtitle
				</CardSubtitle>
			</CardBody>
			<CardBody>
				<CardText>
					Some quick example text to build on the card title and make up the bulk of the card‘s content.
				</CardText>
				<CardLink href="#">
					Card Link
				</CardLink>
				<CardLink href="#">
					Another Link
				</CardLink>
			</CardBody>
		</Card>
	</Col > */
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

export default function Donate() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Donate to ${siteConfig.title}`}
      description={`Donation Information for ${siteConfig.title}.`}
    >
      <main>
        <Repositories />
      </main>
    </Layout>
  );
}
