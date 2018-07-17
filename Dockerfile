FROM nginx:alpine

RUN apk add git
RUN mkdir git
RUN cd git

RUN git clone https://github.com/kishorekkota/EisenhoverMatrix.git

RUN cd EisenhoverMatrix

COPY * /usr/share/nginx/html/
