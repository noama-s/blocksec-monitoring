# blocksec-monitoring-with-jira-integration
Blockchain Listener Script to monitor the deployed LB contracts for security breaches.


# Overview
This Node.js application monitors blockchain smart contracts on Ethereum's mainnet for specific events like OwnershipTransferred, BaseURIset, etc. Upon detection, it automatically creates a Jira ticket for further analysis.

# Features
* Monitoring of smart contracts on Ethereum's mainnet.
* Automatic Jira ticket creation for specific events.
* Easily configurable to add more contract addresses and events.
* Robust error handling and logging.

# Prerequisites
* Node.js v14.x or higher
* npm v7.x or higher
* An Infura account
* A Jira account

# Environment Variables
Before running the application, make sure to set up the following environment variables:

* JIRA_INSTANCE: Your Jira Instance name
* JIRA_PROJECT_KEY: Your Jira Project key
* JIRA_EMAIL: Your Jira registered email
* JIRA_API_TOKEN: Your Jira API token

You can set these variables in a .env file at the root of your project.

# env

``` 
JIRA_INSTANCE=your_instance
JIRA_PROJECT_KEY=your_project_key
JIRA_EMAIL=your_email
JIRA_API_TOKEN=your_api_token
```

# Installation
Clone this repository:

``` 
git clone https://github.com/yourusername/blockchain-monitoring-jira.git
``` 

# Install dependencies:
``` 
cd blockchain-monitoring-jira
npm install
```

# Usage
Add your smart contract addresses and ABI files in the contract-abi folder.

Run the script:
``` 
node index.js
``` 

Your application should now be listening for events on the specified contracts and creating Jira tickets accordingly.
