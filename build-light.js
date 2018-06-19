const fetch = require('node-fetch');

function subscribeToSNS(payload) {
  let subscribeURL = payload.SubscribeURL;
  // Confirm SNS Subscription TODO: Check return
  fetch(subscribeURL)
}

module.exports = function (ctx, cb) {
  // Check SNS Headers
  const msg = ctx.headers['x-amz-sns-message-type']
  if (msg == 'SubscriptionConfirmation') {
    subscribeToSNS(JSON.parse(ctx.body_raw))
    return cb(null, 'Subscribed!')
    
  } else if (msg == 'Notification') {
    const payload = JSON.parse(ctx.body_raw)
    const state = payload['build-status']
  } else {
    return cb(null, 'This endpoint supports SNS messages.')
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
  } else {
    return cb(null, 'Build entered unknown state.')
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
  return cb(null, 'State updated')
}
