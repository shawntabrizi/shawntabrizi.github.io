import React from 'react';
import RawData from './github-repo-info.json';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';


function sort_by_stars(a, b) {
	return b.stars - a.stars;
}
let sorted_data = RawData.sort(sort_by_stars);

function Repository({ name, stars, fork, forksCount, homepage, html_url, language, description }) {
	return (
		<div className={clsx('col col--3')}>
			<div className="text--center">
				<Heading as="h1">{name}</Heading>
				<img src={`${html_url}/blob/master/screenshot.png?raw=true`} />
				<Link
					className="button button--primary button--md"
					to={html_url}>
					GitHub
				</Link>
			</div>
			<div className="text--center padding--md">
				<p>{language}</p>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function Repositories() {
	return (
		<section className={styles.donations}>
			<div className="container">
				<div className="row">
					{sorted_data.filter(a => a.fork == false).map((props, idx) => (
						<Repository key={idx} {...props} />
					))}
				</div>
				<div className="row">
					{sorted_data.filter(a => a.fork == true).map((props, idx) => (
						<Repository key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
