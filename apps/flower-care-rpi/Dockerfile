# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build flower-care-rpi`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t flower-care-rpi`.
FROM nikolaik/python-nodejs:python3.12-nodejs20-slim as builder

WORKDIR /app

RUN addgroup --system flower-care-rpi && \
          useradd --system -g flower-care-rpi flower-care-rpi

RUN apt update && apt install -y build-essential libudev-dev git

RUN corepack enable

COPY dist/apps/flower-care-rpi/package.json dist/apps/flower-care-rpi/pnpm-lock.yaml ./flower-care-rpi/

RUN cd flower-care-rpi && pnpm install --no-frozen-lockfile

COPY dist/apps/flower-care-rpi flower-care-rpi

FROM docker.io/node:lts-slim

WORKDIR /app

COPY --from=builder app/flower-care-rpi  flower-care-rpi

RUN addgroup --system flower-care-rpi && \
          useradd --system -g flower-care-rpi flower-care-rpi

CMD [ "node", "flower-care-rpi" ]
