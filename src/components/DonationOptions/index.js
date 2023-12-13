import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { Col, Row, Container } from "react-bootstrap";

const polkadotData = {
  title: "Polkadot",
  imgSrc: "/assets/images/polkadot-qr.png",
  link: "https://www.subscan.io/account/12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud",
  btnText: "View on Subscan",
  address: "12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud",
};

const kusamaData = {
  title: "Kusama",
  imgSrc: "/assets/images/kusama-qr.png",
  link: "https://kusama.subscan.io/account/EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo",
  btnText: "View on Subscan",
  address: "EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo",
};

const ethereumData = {
  title: "Ethereum",
  imgSrc: "/assets/images/ethereum-qr.png",
  link: "https://etherscan.io/address/0x6D31165d5D932D571F3B44695653b46dCC327E84",
  btnText: "View on Etherscan",
  identifier: "ENS: shawntabrizi.eth",
  address: "0x6D31165d5D932D571F3B44695653b46dCC327E84",
};

const paypalData = {
  title: "PayPal",
  imgSrc: "/assets/images/paypal-qr.png",
  link: "https://www.paypal.me/shawntabrizi/10",
  btnText: "Donate with PayPal",
  address: "shawntabrizi@gmail.com",
};

const DonationList = [polkadotData, kusamaData, ethereumData, paypalData];

function Donation({ title, imgSrc, link, btnText, address, identifier }) {
  return (
    <Col xs={12} md={6} lg={3}>
      <div className="text--center">
        <Heading as="h1">{title}</Heading>
        <img src={imgSrc} />
        <Link className="button button--primary button--md" to={link}>
          {btnText}
        </Link>
      </div>
      <div className="text--center padding--md">
        <p>{address}</p>
        <p>{identifier}</p>
      </div>
    </Col>
  );
}

export default function DonationOptions() {
  return (
    <section className={styles.donations}>
      <Container>
        <Row>
          {DonationList.map((props, idx) => (
            <Donation key={idx} {...props} />
          ))}
        </Row>
      </Container>
    </section>
  );
}
