#!/bin/bash
git pull origin main &&

# CD2: compile css styles
lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css &&

# restart everything CKAN & SOLR
systemctl restart tomcat9 &&
supervisorctl reload && 
service nginx restart