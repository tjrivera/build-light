const express = require('express')
const url = require('url');
const fetch = require('node-fetch')
const md5 = require('md5')
// oAuth Parameters
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let accessToken = null;
let refreshToken = null;

const app = express();

function parseAuthHeader(authData) {
    var authenticationObj = {};
    authData.split(', ').forEach(function (d) {
        d = d.split('=');
 
        authenticationObj[d[0]] = d[1].replace(/"/g, '');
    });
    return authenticationObj;
}

app.get('/oauth', (req, res) => {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const code = query.code;
  console.log('Authenticated! Retrieving Bearer Token...')
  fetch(`https://api.meethue.com/oauth2/token?code=${code}&grant_type=authorization_code`, {
    method: 'POST'
  })
    .then(response => {
      // Construct the response digest
      const header = response.headers.get('www-authenticate')
      const auth = parseAuthHeader(header)
      var h1 = md5(`${clientId}:${auth['Digest realm']}:${clientSecret}`);
      var h2 = md5("POST:/oauth2/token");
      var response = md5(h1 + ":" + auth.nonce + ":" + h2);
      // Retrieve Access Token
      fetch(`https://api.meethue.com/oauth2/token?code=${code}&grant_type=authorization_code`, {
        headers: {
          'Authorization': `Digest username=${clientId}, realm=${auth['Digest realm']}, nonce=${auth.nonce}, uri="/oauth2/token", response=${response}`
        },
        method: 'POST'
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          accessToken = response.access_token
          refreshToken = response.refresh_token
          console.log(`Success use the following token: ${accessToken}`)
          res.send(`export HUE_API_KEY=${accessToken}`)
          process.exit()
        });
  })

});
// Wait a minute for the auth process to complete. otherwise exit
setTimeout(() => {
  console.log('Login timed out')
  process.exit()
}, 60000)
app.listen(8080, () => console.log('Waiting for auth code...'))