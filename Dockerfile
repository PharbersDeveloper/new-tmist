FROM ubuntu:18.04

RUN apt-get update && apt-get install -y && \
	apt-get upgrade -y && \
	apt-get install git -y && \
	apt-get install curl wget -y && apt-get install -y && \
	apt-get install gnupg -y && \
	apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
	apt-get install -y nodejs

ENV EMBERVERSION 3.4.4
ENV	BOWERVERSION 1.8.4

RUN npm update && \
	npm install -g ember-cli@${EMBERVERSION} && \
	npm install -g bower@${BOWERVERSION}

WORKDIR /app

LABEL ucb.version=0.1.4

RUN git clone https://github.com/PharbersDeveloper/new-tmist.git && \
	git clone https://github.com/PharbersDeveloper/BP-Components.git && \
	git clone https://github.com/PharbersDeveloper/phemitter.git

WORKDIR /app/BP-Components

RUN git checkout -b frank origin/frank && \
	npm install && \
	npm link

WORKDIR /app/phemitter

RUN	npm install && \
	npm link

WORKDIR /app/new-tmist

RUN git checkout -b chsun-ucb origin/chsun-ucb && \
	rm -rf node_modules && \
	rm package-lock.json && \
	npm cache clear --force && \
	npm install && \
	bower install foundation --allow-root && \
	bower install ali-oss --allow-root	&& \
	npm link bp-components && \
	npm link phemitter 

RUN ember b --environment production

EXPOSE 8081

ENTRYPOINT ["ember", "s", "--live-reload=false"]
