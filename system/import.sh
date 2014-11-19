geoserver_dir=/var/lib/tomcat7/webapps/geoserver/

cp -r -v ../data $geoserver_dir
service tomcat7 restart