#!/bin/bash
git pull origin main &&

# SOLR: search engine customization
cp /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/config/schema.xml /usr/lib/ckan/default/src/ckan/ckan/config/solr/schema.xml &&

# CD2: compile css styles
lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css &&

# restart everything CKAN & SOLR
systemctl restart tomcat9 &&
supervisorctl reload && 
service nginx restart