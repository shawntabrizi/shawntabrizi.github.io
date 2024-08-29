const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const username = 'shawntabrizi';

// Create an instance of the Octokit class without authentication
const octokit = new Octokit({
	// auth: "key"
});

async function getRepositoryInfo() {
	try {
		let page = 1;
		let repos = [];

		// Make requests until all repositories are fetched
		while (true) {
			// Get the list of repositories for the specified user without authentication
			const { data: repositories, headers } = await octokit.repos.listForUser({
				username,
				page,
				per_page: 100, // Adjust per_page as needed, max is 100
			});

			// Append the current page's repositories to the array
			for (const repo of repositories) {
				const screenshotPath = await downloadScreenshot(repo.name);

				repos.push({
					name: repo.name,
					stars: repo.stargazers_count,
					fork: repo.fork,
					forksCount: repo.forks_count,
					homepage: repo.homepage,
					html_url: repo.html_url,
					language: repo.language,
					description: repo.description,
					screenshot: screenshotPath,
				});
			}

			// Check if there are more pages
			const nextPage = headers.link && headers.link.match(/<([^>]+)>;\s*rel="next"/);
			if (nextPage) {
				page++;
			} else {
				break; // No more pages
			}
		}

		// Write the array to a JSON file
		const jsonContent = JSON.stringify(repos, null, 2);
		fs.writeFileSync('github-repo-info.json', jsonContent, 'utf-8');

		console.log('Repository information has been written to github-repo-info.json');
	} catch (error) {
		console.error('Error fetching repository information:', error.message);
	}
}

async function downloadScreenshot(repoName) {
	try {
		const defaultBranch = 'master';
		const url = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/screenshot.png`;
		const response = await axios.get(url, { responseType: 'arraybuffer' });

		// Create a 'screenshots' folder if it doesn't exist
		const screenshotsFolder = path.join(__dirname, 'screenshots');
		if (!fs.existsSync(screenshotsFolder)) {
			fs.mkdirSync(screenshotsFolder);
		}

		const filePath = path.join(screenshotsFolder, `${repoName}-screenshot.png`);
		fs.writeFileSync(filePath, Buffer.from(response.data));

		console.log(`Screenshot for ${repoName} downloaded successfully.`);
		return filePath;
	} catch (error) {
		console.error(`Error downloading screenshot for ${repoName}:`, error.message);
		return null;
	}
}

// Call the function to get and save repository information
getRepositoryInfo();
