import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { Col, Container, Row } from "react-bootstrap";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="a site about discovery through experience"
    >
      <main className={styles.heroBanner}>
        <Container>
          <Row>
            <Col sm={12} lg={6}>
              <img
                className={styles.roundedCircle}
                src={"assets/images/DSC013041.jpg"}
              />
            </Col>
            <Col sm={12} lg={6}>
              <Heading as="h1">
                My name is Shawn Tabrizi and I am a full-time engineer living in
                Puerto Rico.
              </Heading>
              <p>
                I was born and raised in the heart of the bay area, a breeding
                pool of technology and innovation. I first started programming
                at the age of 13, trying to learn how to hack my PlayStation
                Portable so that I could play free games. Through the PSP
                hacking community, I learned about the vast potential
                surrounding computers, programming, and the internet.
              </p>
              <p>
                I graduated from the{" "}
                <a href="https://ccs.ucsb.edu/">College of Creative Studies</a>{" "}
                at the University of California, Santa Barbara studying Physics
                and Mathematics.
              </p>
              <p>
                I joined Microsoft less than a month later to work on Microsoft
                Azure, their cloud computing services.
              </p>
              <p>
                I then contributed to{" "}
                <a href="https://polkadot.network/">Polkadot</a> as a Lead
                Developer at Parity Technologies, working on blockchain
                infrastructure and the future of the decentralized web.
              </p>
              <p>
                I now work independently as a{" "}
                <a href="https://github.com/polkadot-fellows">
                  Polkadot Fellow
                </a>
                , contributing to and creating open source software.
              </p>
              <p>
                I am always interested in new adventures, so please feel free to
                use any of the social links below to contact me.
              </p>
            </Col>
          </Row>
        </Container>
      </main>
    </Layout>
  );
}
