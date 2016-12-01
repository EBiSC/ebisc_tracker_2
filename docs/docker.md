How to run the data tracker in docker
=======================

In the Embassy deployment, all components of the data tracker run in [docker](https://www.docker.com/) containers, i.e. go, mongodb, the perl tracking code etc.

For development, you can run the same containers on your local machine.
For development convenience, you can use [Docker compose](https://docs.docker.com/compose/) to easily start and stop the services. (but note we do not use docker-compose in production)

1. Mongodb
----------

Bring up the server

  docker-compose up -d mongodb

Use this command if you want to start a client to poke around in the database:

  docker-compose run db_client

* We use the [openshift/mongodb-32-centos7](https://hub.docker.com/r/openshift/mongodb-32-centos7/) mongodb image because it is production-ready and runs non-root.
* We use different passwords in production and development.

2. Perl tracking code
---------------------

These are the scripts that get run twice daily, to gather the data from IMS, hPSCreg etc.

First get the perl dependencies. For convenience in development, the modules will get installed on your local machine in the directory ./tracker/local. This means you don't have to re-install dependencies each time you build a new image.

  docker-compose run cpanm

Next, set up your environment with your hpscreg and ims username and password:

  export HPSCREG_USER=??????
  export HPSCREG_PASS=??????
  export IMS_USER=??????
  export IMS_PASS=??????

Next, run the tracking code:

  docker-compose run tracker

3. Compile angular code:
-----------------------

This is development conenience.  We build the javascript onto your local machine so you don't have to rebuild it each time your images chanegs.

  docker-compose run npm

3. Go webserver
---------------

First build the webserver.  Again, this is development convenience. We fetch the external dependencies onto your local machine so you don't have to re-fetch them when your image changes.

  docker-compose run webserver_build

Now bring up the webserver:

  docker-compose up -d webserver

This serves the app on port 8000 of your local machine. Open this link in your webrowser: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Principles of secure docker deployment
===============================

* All containers run non-root
* SELinux is enforced in production
* Drop all capabilities
* Only publish the important ports to localhost.
* Mount file systems read-only where possible.
* Use official docker repos, not user-contributed.  The only place where I broke this rule is the centos/mongodb image.
* Keep passwords and API keys out of the image, in case the image ever accidentally ends up in a public repo.  Pass in passwords and keys at run time using environment variables.
* Run on a host with a minimal operating system. On Embassy we use coreos.

