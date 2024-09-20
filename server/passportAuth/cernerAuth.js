const axios = require('axios');
const querystring = require('querystring');

require('dotenv').config();
const router = require('express').Router();

const crypto = require('crypto');

const generateRandomState = (length = 16) => {
    return crypto.randomBytes(length).toString('hex');
};

// Configuration: Replace with your actual values
const clientId = '1b7f5e72-fd8d-4755-bba3-9fb9bc2f043b'; // Your client_id
const redirectUri = 'http://localhost:8000/api/auth/cerner/callback'; // Your redirect URI
const fhirAud = 'https://fhir-ehr-code.cerner.com/ec2458f2-1e24-41c8-b71b-0e701af7583d'; // FHIR server audience
const authUrl = 'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/personas/provider/authorize';
const scope = 'profile fhirUser openid online_access' 

// Step 2: Redirect the user to the Cerner authorization server
router.get('/cerner', (req, res) => {
    const state = generateRandomState(); // Generate random state

    // Build query parameters
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        aud: fhirAud,
        state: state,
        scope: 'profile fhirUser openid online_access' 
    });

    // Construct the full authorization URL
    const fullAuthUrl = `${authUrl}?${params.toString()}`;

    // Redirect the user to the Cerner authorization URL
    res.redirect(fullAuthUrl);
});
router.get('/cerner/callback', async (req, res) => {
    const { code, state } = req.query;

    // Verify the state parameter here (e.g., check it against a stored value)
    const tokenUrl = 'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/hosts/fhir-ehr-code.cerner.com/protocols/oauth2/profiles/smart-v1/token';
    const clientId = process.env.CERNER_CLIENT_ID;
    const clientSecret = process.env.CERNER_CLIENT_SECRET; // Ensure this is stored securely
    const redirectUri = process.env.CERNER_REDIRECT_URI;

    try {
        const data = console.log("yay!,we recieved a call back")
        // Handle token (e.g., save it to a session or database)
        res.json(data);
    } catch (error) {
        console.error('Error exchanging code for token:');
        res.status(500).send('Server Error');
    }
});

module.exports = router;
