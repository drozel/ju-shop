ARG BASE_PATH

FROM node:20 AS web_builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/webpack.config.js ./
COPY frontend/src ./src
COPY frontend/public ./public

RUN npm run build


FROM python:3.12.12-slim

WORKDIR /jushop

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

COPY main.py /jushop
COPY requirements.txt /jushop
COPY docker_entrypoint.sh /jushop/entrypoint.sh

RUN chmod +x /jushop/entrypoint.sh

RUN cd /jushop && pip install -r requirements.txt

COPY --from=web_builder /frontend/build /jushop/frontend
COPY /frontend/static /jushop/frontend


ARG BASE_PATH
ENV BASE_PATH=${BASE_PATH}

EXPOSE 80

ENTRYPOINT ["/usr/bin/tini", "--", "/jushop/entrypoint.sh"]
