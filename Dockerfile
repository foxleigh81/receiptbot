FROM ubuntu:groovy

RUN apt-get update -y && apt-get install -y nodejs npm

COPY . /bot

WORKDIR /bot

RUN npm install -g yarn

RUN yarn install

RUN yarn build

CMD yarn start

# TODO: token is not being applied for some reason