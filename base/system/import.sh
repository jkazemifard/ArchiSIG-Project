geoserver_dir=/var/lib/tomcat7/webapps/geoserver/

chmod 777 -R ../data
cp -r -v ../data $geoserver_dir

service tomcat7 restart