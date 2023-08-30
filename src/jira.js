const axios = require('axios');
require('dotenv').config()
function replacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString();  // convert BigInt to string
    }
    return value;
}

async function createJiraTicket(event) {
    console.log('--- STARTING JIRA TICKET CREATION ---');

    // Check Environment Variables
    console.log('JIRA_INSTANCE:', process.env.JIRA_INSTANCE);
    console.log('JIRA_PROJECT_KEY:', process.env.JIRA_PROJECT_KEY);
    console.log('JIRA_EMAIL:', process.env.JIRA_EMAIL);
    // DON'T log the API token for security reasons

    const jiraUrl = `https://${process.env.JIRA_INSTANCE}.atlassian.net/rest/api/3/issue`;

    const data = {
        "fields": {
            "project": {
                "key": process.env.JIRA_PROJECT_KEY
            },
            "summary": `[Monitoring] - New Event: ${event.event}`,
            "description": {
                "version": 1,
                "type": "doc",
                "content": [
                            {
                                "type": "text",
                                "text": `Detailed information about the event:\n
                                - Contract: ${event.address}\n
                                - Transaction Hash: ${event.transactionHash}\n
                                - Block Number: ${event.blockNumber}\n
                                - Event Type: ${event.event}\n
                                - Event Arguments: ${JSON.stringify(event.returnValues, replacer)}\n
                                - Timestamp: ${event.timestamp}\n
                                - From: ${event.returnValues.from || 'N/A'}\n
                                - To: ${event.returnValues.to || 'N/A'}\n`
                    }
                ]
            },
            "issuetype": {
            "name": "Task" 
            }
        }
    };
    // Validate Event Data
    console.log('Sending data:', JSON.stringify(data, null, 2));

    const config = {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(jiraUrl, data, config);
        console.log(`Ticket created: ${response.data.key}`);
    } catch (error) {
        console.error(`Error creating ticket: ${error.message}`);
        if (error.response && error.response.data) {
            console.error('Jira API response:', error.response.data);
        }
    }
}

// Export the function so it can be used in other files
module.exports = createJiraTicket;
