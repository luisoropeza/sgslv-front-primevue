FROM node:20-alpine
RUN npm install -g http-server
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build
EXPOSE 80
CMD [ "http-server", "dist" ]
