FROM node:14

COPY . /bot

WORKDIR /bot

RUN yarn install

RUN yarn build

CMD yarn start