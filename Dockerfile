ARG BASE_PATH

FROM node:25.5.0 AS web_builder

COPY frontend/package*.json frontend/webpack.config.js /frontend/
COPY frontend/src /frontend/src
COPY frontend/public /frontend/public

RUN cd /frontend && npm install && npm run build


FROM python:3.12.12-slim

WORKDIR /jushop

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

ENTRYPOINT ["bash", "-c", "/jushop/entrypoint.sh"]
