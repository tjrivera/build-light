const fetch = require('node-fetch');

function subscribeToSNS(payload) {
  let subscribeURL = payload.SubscribeURL;
  // Confirm SNS Subscription TODO: Check return
  fetch(subscribeURL)
}

module.exports = function (ctx, cb) {
  // console.log(ctx.headers)
  const msg = ctx.headers['x-amz-sns-message-type']
  if (msg == 'SubscriptionConfirmation') {
    subscribeToSNS(ctx.body)
  } else {
    const state = ctx.body.detail['build-status']
  }
  
  // URL Construction
  const baseUrl = 'https://api.meethue.com/bridge/';
  const userId = ctx.secrets.USER_ID;
  const hueKey = ctx.secrets.HUE_API_KEY;
  const lightId = ctx.secrets.LIGHT_ID;
  const url = `${baseUrl}${userId}/lights/${lightId}/state`;

  // Determine Colors
  let color = 0
  if (state == 'SUBMITTED') {
    color = 9989
  } else if (stage == 'FAILED') {
    color = 65535;
  } else if (stage == 'SUCCEEDED') {
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
