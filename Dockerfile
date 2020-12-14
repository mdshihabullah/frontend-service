#Download the busybox image for hosting a simple webserver
FROM busybox:1.32
#copy the whole project from root and paste in the webserver directory of the image to be build
COPY ./* /webserver//

WORKDIR /webserver

#Once a container is created from the image, 
# it runs command "busybox"inside the container with httpd and -f as args of command
#ENTRYPOINT is a mandatory arguments in image
ENTRYPOINT ["busybox", "httpd", "-f"]

#CMD is the additional argument 
#which can or want to be overwritten when we spin up the container
CMD ["-p", "8000"]
