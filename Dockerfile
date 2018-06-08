FROM node
WORKDIR /root/
COPY . .
RUN npm install
CMD npm run start
