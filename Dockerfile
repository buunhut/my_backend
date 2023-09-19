FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

# cài node module trên server
RUN yarn install 

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

EXPOSE 8080

CMD ["yarn","start"]

# docker build . -t img-backend

# docker run -d -p 8080:8080 --name cons-backend img-backend


#ssh-keygen -R "61.14.233.80"
#ssh-keyscan -p 2018 61.14.233.80 >> ~/.ssh/known_hosts

#curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

#docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 mysql:latest