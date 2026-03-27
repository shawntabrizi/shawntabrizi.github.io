import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://shawntabrizi.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
  redirects: {
    // Old category-based slugs → new /blog/ URLs
    "/personal/discovery-through-experience/":
      "/blog/discovery-through-experience/",
    "/aad/decoding-jwt-tokens/": "/blog/decoding-jwt-tokens/",
    "/aad/azure-ad-authentication-with-powershell-and-adal/":
      "/blog/azure-ad-authentication-with-powershell-and-adal/",
    "/aad/secret-apis-in-azure-active-directory-and-azure-resource-manager/":
      "/blog/secret-apis-in-azure-active-directory-and-azure-resource-manager/",
    "/aad/does-company-x-have-an-azure-active-directory-tenant/":
      "/blog/does-company-x-have-an-azure-active-directory-tenant/",
    "/code/customizing-wordpresss-twenty-seventeen-theme/":
      "/blog/customizing-wordpresss-twenty-seventeen-theme/",
    "/aad/clients-tokens-claims-oh-my/": "/blog/clients-tokens-claims-oh-my/",
    "/code/scraping-linkedin-topics-skills-data/":
      "/blog/scraping-linkedin-topics-skills-data/",
    "/aad/revoking-consent-azure-active-directory-applications/":
      "/blog/revoking-consent-azure-active-directory-applications/",
    "/aad/refresh-tokens-azure-ad-v2-applications-flask/":
      "/blog/refresh-tokens-azure-ad-v2-applications-flask/",
    "/aad/common-microsoft-resources-azure-active-directory/":
      "/blog/common-microsoft-resources-azure-active-directory/",
    "/aad/adding-aad-service-principal-company-administrator-role-using-aad-powershell-module/":
      "/blog/adding-aad-service-principal-company-administrator-role-using-aad-powershell-module/",
    "/ethereum/getting-started-ethereum-wallet/":
      "/blog/getting-started-ethereum-wallet/",
    "/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/":
      "/blog/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/",
    "/ethereum/correcting-ethereum-web3-js-hello-world/":
      "/blog/correcting-ethereum-web3-js-hello-world/",
    "/ethereum/ethereum-token-contract-abi-web3-erc-20-human-standard-tokens/":
      "/blog/ethereum-token-contract-abi-web3-erc-20-human-standard-tokens/",
    "/ethereum/making-web3-js-work-asynchronously-javascript-promises-await/":
      "/blog/making-web3-js-work-asynchronously-javascript-promises-await/",
    "/ethereum/ethfolio-client-side-app-show-ethereum-token-distribution/":
      "/blog/ethfolio-client-side-app-show-ethereum-token-distribution/",
    "/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/":
      "/blog/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/",
    "/code/set-azure-service-health-alerts-programmatically-using-powershell/":
      "/blog/set-azure-service-health-alerts-programmatically-using-powershell/",
    "/ethereum/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/":
      "/blog/graphing-eth-balance-history-of-an-ethereum-address-using-parallel-asynchronous-requests-in-web3-js/",
    "/ethereum/shawn-notes-cryptozombies-lessons-1-5-in-solidity/":
      "/blog/shawn-notes-cryptozombies-lessons-1-5-in-solidity/",
    "/ethereum/using-web3-js-1-0-subscribe-and-infura-websockets-to-visualize-ethereum-transactions/":
      "/blog/using-web3-js-1-0-subscribe-and-infura-websockets-to-visualize-ethereum-transactions/",
    "/aad/microsoft-identities-on-the-ethereum-blockchain/":
      "/blog/microsoft-identities-on-the-ethereum-blockchain/",
    "/aad/building-a-simple-sign-in-page-with-msal-js-for-microsoft-identities/":
      "/blog/building-a-simple-sign-in-page-with-msal-js-for-microsoft-identities/",
    "/ethereum/getting-twitter-posts-for-ethereum-using-an-oracle/":
      "/blog/getting-twitter-posts-for-ethereum-using-an-oracle/",
    "/personal/4-things-i-learned-in-4-years-at-microsoft/":
      "/blog/4-things-i-learned-in-4-years-at-microsoft/",
    "/substrate/running-parity-substrate-on-mac-os-x/":
      "/blog/running-parity-substrate-on-mac-os-x/",
    "/code/combining-rocket-with-reqwest-to-call-an-api-with-rust/":
      "/blog/combining-rocket-with-reqwest-to-call-an-api-with-rust/",
    "/ethereum/verify-ethereum-contracts-using-web3-js-and-solc/":
      "/blog/verify-ethereum-contracts-using-web3-js-and-solc/",
    "/substrate/proof-of-existence-blockchain-with-substrate/":
      "/blog/proof-of-existence-blockchain-with-substrate/",
    "/substrate/cryptokitties-on-substrate/":
      "/blog/cryptokitties-on-substrate/",
    "/substrate/substrate-at-fosdem-2019/":
      "/blog/substrate-at-fosdem-2019/",
    "/substrate/the-sudo-story-in-substrate/":
      "/blog/the-sudo-story-in-substrate/",
    "/substrate/substrate-smart-contracts-workshop/":
      "/blog/substrate-smart-contracts-workshop/",
    "/substrate/adding-fees-to-your-substrate-runtime-module/":
      "/blog/adding-fees-to-your-substrate-runtime-module/",
    "/substrate/extending-substrate-runtime-modules/":
      "/blog/extending-substrate-runtime-modules/",
    "/substrate/querying-substrate-storage-via-rpc/":
      "/blog/querying-substrate-storage-via-rpc/",
    "/substrate/substrate-feeless-token-factory/":
      "/blog/substrate-feeless-token-factory/",
    "/substrate/what-is-substrate/": "/blog/what-is-substrate/",
    "/substrate/substrate-storage-deep-dive/":
      "/blog/substrate-storage-deep-dive/",
    "/substrate/porting-web3-js-to-polkadot-js/":
      "/blog/porting-web3-js-to-polkadot-js/",
    "/substrate/substrate-weight-and-fees/":
      "/blog/substrate-weight-and-fees/",
    "/substrate/transparent-keys-in-substrate/":
      "/blog/transparent-keys-in-substrate/",
    "/personal/web3-reading-list/": "/blog/web3-reading-list/",
  },
});
