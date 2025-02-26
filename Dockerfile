FROM public.ecr.aws/docker/library/node:18

ENV NODE_ENV=production
WORKDIR /opt/app
RUN apt-get update && \
    apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev librsvg2-dev

ENV ORACLE_CLIENT_FILENAME oracle-instantclient-basiclite-21.1.0.0.0-1.x86_64.rpm

RUN apt-get update && \
    apt-get install -y alien libaio1 curl libaio1 libaio-dev libssl-dev musl-dev unzip wget python3 python3-pip
RUN wget https://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient21/x86_64/getPackage/${ORACLE_CLIENT_FILENAME} \
 && alien -i --scripts ${ORACLE_CLIENT_FILENAME} \
 && rm -f ${ORACLE_CLIENT_FILENAME} \
 && apt -y autoremove \
 && apt -y clean \
 && rm -rf /var/lib/apt/lists/* \
 && ldconfig

COPY . .
RUN npm install --production --silent
RUN npm install -g pm2
RUN python3 --version
RUN pip3 install -r src/python/requirements.txt --break-system-packages

ENV PM2_HOME /opt/app/.pm2
ENV UV_THREADPOOL_SIZE 16

RUN chgrp -R 0 /opt/app/ && chmod -R g+rwX /opt/app/
EXPOSE 3000
USER node:root
CMD ["pm2-runtime", "/opt/app/src/main/start.js"]
