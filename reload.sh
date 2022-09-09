#!/bin/bash
git pull &&

# CKAN: ckan.ini
# cp ckanext/ckan_config/ckan.ini /etc/ckan/default/ckan.ini &&

# SOLR: search engine customization
cp ckanext/ckan_config/schema.xml /usr/lib/ckan/default/src/ckan/ckan/config/solr/schema.xml &&

# CKAN: ckanext-msl-ckan plugin: custom facets & repeating fields flattening of SOLR indexing
cp ckanext/ckan_config/facets.json /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/config/facets.json &&
cp ckanext/ckan_config/msl_index_fields.json /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/config/msl_index_fields.json &&

# CKAN: schema definitions
cp -r ckanext/ckan_config/schemas /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/schemas

# CD2: compile css styles
lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css &&

# restart everything CKAN & SOLR
systemctl restart tomcat9 &&
supervisorctl reload && 
service nginx restart