currentDir=`pwd`

################################################################################
# Install required Debian packages
#
_packages="curl tomcat7 unzip postgresql-9.1 postgresql-9.1-postgis"

apt-get install --yes -o Dpkg::Options::=--force-confdef --no-upgrade $_packages

local _pg_config=/etc/postgresql/9.1/main/postgresql.conf
if [ -f $_pg_config ]; then
    rm -f $_pg_config
    echo "Setting symlink for: $_pg_config"
    ln -s ../../../postgresql-common/postgresql.conf $_pg_config
    service postgresql restart
    # postgres / postgres
    echo "ALTER ROLE postgres ENCRYPTED PASSWORD 'md53175bce1d3201d16594cebf9d7eb3f9d'" | sudo -u postgres psql
fi

################################################################################
# Install GeoServer WAR file on tomcat

war_dest_dir=/var/lib/tomcat7/webapps
war_file=geoserver.war
geoserver_war_zip_url=http://freefr.dl.sourceforge.net/project/geoserver/GeoServer/2.5.2/geoserver-2.5.2-war.zip

if [ ! -f $war_dest_dir/$war_file ]; then
    tmp_dir=$(mktemp -d)
    zip_file=$(mktemp)

    echo "Downloading: $geoserver_war_zip_url"
    curl -L $geoserver_war_zip_url >$zip_file || echo  "could not download geoserver"
    cd $tmp_dir
    unzip $zip_file || echo "could not unzip GeoServer archive"
    mv $war_file $war_dest_dir || echo "could not install geoserver.war into: $war_dest_dir"
    rm -rf $tmp_dir $zip_file
    # tomcat7 listen on IPv6 ::0 only, we have to change to IPv4 0.0.0.0
    sed -ri 's/(Connector) (port=)/\1 address="0.0.0.0" \2/g' /etc/tomcat7/server.xml
    echo "Done installing $war_dest_dir/$war_file"
    service tomcat7 restart

fi

geoserver_dir=$war_dest_dir/geoserver/

if [ -d $geoserver_dir ]; then
	echo "Installing Data Extraction service"
	cd $currentDir
	cp -r -v files/ExtractData/ $war_dest_dir/
	
	if [ -d $war_dest_dir/ExtractData ]; then
		ip=`ifconfig|xargs|awk '{print $7}'|sed -e 's/[a-z]*:/''/'`
		echo "Installation finished, go to $ip:8080/ExtractData"
	fi
else
	echo "ERROR, GeoServer has not been installed"
fi