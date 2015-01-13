currentDir=`pwd`

war_dest_dir=/var/lib/tomcat7/webapps

geoserver_dir=$war_dest_dir/geoserver/

if [ -d $geoserver_dir ]; then
	echo "Installing Data Extraction service"
	cd $currentDir
	cp -r -v files/ExtractData/ $war_dest_dir/
	
	# Remove all layergroups because those are buggy in this geoserver version and will conflict when our UI will try to get WMS capabilities
	rm $geoserver_dir/data/layergroups/*
	
	if [ -d $war_dest_dir/ExtractData ]; then
		ip=`ifconfig|xargs|awk '{print $7}'|sed -e 's/[a-z]*:/''/'`
		echo "Installation finished, go to $ip:8080/ExtractData"
	fi
else
	echo "ERROR, GeoServer has not been installed"
fi

service tomcat7 restart
