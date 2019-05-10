#!/bin/sh

echo this might need "sudo" for docker access

docker build --file=Dockerfile-tracker \
	--build-arg=http_proxy=$http_proxy \
	--build-arg=https_proxy=$https_proxy \
	--add-host=proxy.charite.de:141.42.5.215 \
	--tag=ebisc/tracker-test \
	.

docker run ebisc/tracker-test \
	perl -I/usr/src/myapp/lib /usr/src/myapp/test.pl
