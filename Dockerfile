FROM yarnpkg/dev

ARG telegram_bot_token

ENV telegram_bot_token $telegram_bot_token

COPY . /bot

WORKDIR /bot

COPY . /bot

RUN yarn install

RUN yarn build

CMD yarn start

# TODO: token is not being applied for some reason