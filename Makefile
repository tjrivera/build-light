
.PHONY: deps
deps:
	@npm install

.PHONY: login
login:
	@node oauth.js & 
	@open "https://api.meethue.com/oauth2/auth?clientid=hPveNiGAyLALPluTn5TBNVfQKGfQXKlR&appid=buildlight&state=bl&deviceid=bllambda&response_type=code"
	
.PHONY: serve
serve:
	wt serve build-light.js \
          --secrets-file secrets.env

.PHONY: watch
watch:
	wt create build-light.js \
          --watch \
          --name build-light \
          --secrets-file secrets.env
.PHONY: create
create:
	wt create build-light.js \
          --watch \
          --name build-light \
          --secrets-file secrets.env