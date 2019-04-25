if [ "$1" == "-prod" ]
then
    echo building the files via prod config...
    cd $FE_US && docker run -i --rm=true --env env=sandbox -v $(pwd)/public:/node-workspace/public `whoami`-usaspending-frontend /bin/sh -c 'npm run prod'
    docker run -p 8020:80 -v $(pwd)/public:/usr/share/nginx/html:ro nginx
fi
if [ "$1" == "-dev" ]
then
    echo building the files via dev config...
    cd $FE_US && docker run -i --rm=true --env env=sandbox -v $(pwd)/public:/node-workspace/public `whoami`-usaspending-frontend /bin/sh -c 'npm run dev'
    docker run -p 8020:80 -v $(pwd)/public:/usr/share/nginx/html:ro nginx
fi
if [ "$1" == "" ]
then
    echo you did nothing, pass either -prod or -dev
fi
