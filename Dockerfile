FROM node:12

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if["$NODE_ENV"="development"];\
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./

ENV PORT 5000
# Expose is not really used for actual port setting, just for documentation
EXPOSE $PORT

CMD ["node","index.js"]




