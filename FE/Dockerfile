FROM node:20.10.0
RUN npm install -g serve
RUN mkdir ./build
ADD ./build ./build
CMD ["serve", "-s", "build"]