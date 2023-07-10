FROM node:lts-alpine

COPY . /srv/videotest

WORKDIR /srv/videotest

RUN npm install && npm run build

# Done building, now prepare for running
FROM node:lts-alpine

COPY --from=0 /srv/videotest /srv/videotest
WORKDIR /srv/videotest

RUN rm -r node_modules && npm ci --omit dev && adduser -D videotest && rm -r src

EXPOSE 3000

ENV OUTPUT_PATH=/data
ENV ORIGIN=http://localhost:3000

CMD ["npm", "run", "run-prod"]

USER videotest

