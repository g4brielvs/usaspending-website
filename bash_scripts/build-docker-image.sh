echo usaspending front end docker image w/ name `whoami`-usaspending-frontend...

# replace with the relevant ENV variable
cd $FE_US

docker build . -t `whoami`-usaspending-frontend
