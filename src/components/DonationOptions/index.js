import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const polkadotData = {
	title: 'Polkadot',
	imgSrc: '/assets/images/polkadot-qr.png',
	link: 'https://www.subscan.io/account/12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud',
	btnText: 'View on Subscan',
	address: '12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud',
};

// Data for Kusama section
const kusamaData = {
	title: 'Kusama',
	imgSrc: '/assets/images/kusama-qr.png',
	link: 'https://kusama.subscan.io/account/EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo',
	btnText: 'View on Subscan',
	address: 'EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo',
};

// Data for Ethereum section
const ethereumData = {
	title: 'Ethereum',
	imgSrc: '/assets/images/ethereum-qr.png',
	link: 'https://etherscan.io/address/0x6D31165d5D932D571F3B44695653b46dCC327E84',
	btnText: 'View on Etherscan',
	identifier: 'ENS: shawntabrizi.eth',
	address: '0x6D31165d5D932D571F3B44695653b46dCC327E84',
};

// Data for PayPal section
const paypalData = {
	title: 'PayPal',
	imgSrc: '/assets/images/paypal-qr.png',
	link: 'https://www.paypal.me/shawntabrizi/10',
	btnText: 'Donate with PayPal',
	address: 'shawntabrizi@gmail.com',
};

const DonationList = [
	polkadotData,
	kusamaData,
	ethereumData,
	paypalData,
];

function Donation({ title, imgSrc, link, btnText, address, identifier }) {
	return (
		<div className={clsx('col col--3')}>
			<div className="text--center">
				<Heading as="h1">{title}</Heading>
				<img src={imgSrc} />
				<Link
					className="button button--primary button--md"
					to={link}>
					{btnText}
				</Link>
			</div>
			<div className="text--center padding--md">
				<p>{address}</p>
				<p>{identifier}</p>
			</div>
		</div>
	);
}

export default function DonationOptions() {
	return (
		<section className={styles.donations}>
			<div className="container">
				<div className="row">
					{DonationList.map((props, idx) => (
						<Donation key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
