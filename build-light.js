const fetch = require('node-fetch');

module.exports = function (ctx, cb) {
  
  // URL Construction
  const baseUrl = 'https://api.meethue.com/bridge/';
  const userId = ctx.secrets.USER_ID;
  const hueKey = ctx.secrets.HUE_API_KEY;
  const lightId = ctx.secrets.LIGHT_ID;
  const url = `${baseUrl}${userId}/lights/${lightId}/state`;

  // Determine Colors
  const stage = ctx.query.stage ? ctx.query.stage: 'Unknown';
  let color = 0
  if (stage == 'start') {
    color = 9989
  } else if (stage == 'failed') {
    color = 65535;
  } else if (stage == 'success') {
    color = 23976;
  }
  
  // Update Light State
  fetch(url, {
    headers: {
      'Authorization': `Bearer ${hueKey}`,
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(
      {
        on: true,
        hue: color
      }
    )
  })
    .then(response => response.json())
    .then(data => console.log(data));
  if (stage== 'Unknown') {
    cb(null, `Provide stage query parameter: start, failed, success`); 
  } else {
    cb(null, `Stage updated to ${stage}`); 
  }
}
