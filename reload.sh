#!/bin/bash
git pull &&

# CKAN: ckan.ini
# cp ckanext/ckan_config/ckan.ini /etc/ckan/default/ckan.ini &&

# SOLR: search engine customization
cp ckanext/ckan_config/schema.xml /usr/lib/ckan/default/src/ckan/ckan/config/solr/schema.xml &&

# CKAN: ckanext-msl-ckan plugin: custom facets & repeating fields
cp ckanext/ckan_config/facets.json /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/config/facets.json &&
cp ckanext/ckan_config/msl_index_fields.json /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/config/msl_index_fields.json &&

# CKAN: schema definitions
cp ckanext/ckan_config/cd2_data.collection.yml /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/schemas/datasets/cd2_data.collection.yml &&
cp ckanext/ckan_config/cd2_wave.yml /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/schemas/datasets/cd2_wave.yml &&
cp ckanext/ckan_config/ddi_studyunit.yml /usr/lib/ckan/default/src/ckanext-msl-ckan/ckanext/msl_ckan/schemas/datasets/ddi_studyunit.yml &&

# CD2: compile css styles
lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css &&

# restart everything CKAN & SOLR
systemctl restart tomcat9 &&
supervisorctl reload && 
service nginx restart