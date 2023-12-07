import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import Layout from '@theme/Layout';
import DonationOptions from '@site/src/components/DonationOptions';


export default function Donate() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`Donate to ${siteConfig.title}`}
			description={`Donation Information for ${siteConfig.title}.`}>
			<main>
				<DonationOptions />
			</main>
		</Layout>
	);
}
