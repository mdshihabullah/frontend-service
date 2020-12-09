FROM busybox:1.32

COPY ./* /webserver//

WORKDIR /webserver

ENTRYPOINT ["busybox", "httpd", "-f"]
CMD ["-p", "8000"]


