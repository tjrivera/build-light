# Build-Light

---

This project uses Auth0 Webtasks and Philips Hue's remote bridge to control a Philip's Hue bulb. It is basically a traffic light and is currently tied to a AWS Codebuild job to indicate the builds current status. 

Requirements:

* Philips Hue Application Registration
* Node 4+ 
* Webtask CLI (npm install -g wt-cli)

Define secrets in `secrets.env` file:

```
# From Philips Hue Application
CLIENT_ID="<app_client_id>"
CLIENT_SECRET="<app_client_secret>"
# Retrieved from Login Process (Bearer Token)
HUE_API_KEY=<bearer_token>
# Whitelisted user entry for remote Hue administration -- Ref: https://developers.meethue.com/documentation/remote-hue-api
USER_ID=<whitelisted_entry>
# Hue Light ID
LIGHT_ID=<int: 4, 5, etc>
```

### Quickstart 

Create a Webtask profile (you may need to update `wt-cli` see: https://github.com/auth0/wt-cli/issues/212)
```
AUTH_MODE=v2 wt init
```

Download dependencies
```
make deps
```

Authenticate
```
make login
```

This should give you the bearer token needed to authenticate. 


Local dev:
```
make serve 
```

Deploy:
```
make create
```

After deploying the webtask create an SNS topic and create a subscription to the webtask endpoint provided. After the subscription you'll also want to create a CloudWatch rule that sends all CodeBuild state changes to the SNS topic you created. 

TODO:
* Bearer token should automatically update using provided refresh token.


---
MIT Licensed