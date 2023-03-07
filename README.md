# CD² CKAN theme

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
    
CKAN theme for the CD² metadata portal (cloned from [ckanext-dia_theme](https://github.com/data-govt-nz/ckanext-dia_theme))

![Screenshot](https://github.com/UtrechtUniversity/ckanext-cd2_theme/blob/main/ckanext/cd2_theme/public/img/screenshot.png?raw=true)


## Requirements

CKAN 2.9.x


## Installation

Use [cd2-ansible](https://github.com/UtrechtUniversity/cd2-ansible) to create a fully functional CKAN environment with this theme. 

To install the theme in an existing environment:

1. Activate your CKAN virtual environment, for example::

     sudo -s
     . /usr/lib/ckan/default/bin/activate

2. Install the ckanext-cd2_theme Python package into your virtual environment::

     pip install ckanext-cd2_theme

3. Add ``cd2_theme`` to the ``ckan.plugins`` setting in your CKAN
   config file (by default the config file is located at
   ``/etc/ckan/default/ckan.ini``).

4. Restart CKAN. For example if you've deployed CKAN with Nginx on Ubuntu::

    sudo supervisorctl reload && sudo service nginx restart


## CSS Styling

Any CSS styling changes should be done in the LESS files and NOT directly in the CSS files. Edit the LESS files and compile to CSS using a LESS compiler, i.e.:

    npm install -g less
    lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css


## Updating and testing

Configuration of SOLR, schemas, facets and images is done via [cd2-config](https://github.com/UtrechtUniversity/cd2-config)


## Specific CD² configurations

The theme contains functionality with several references to specific elements of the CD² meta-data schema, which may cause issues with broader usage. The following pages contain direct references to the CD² meta-data schema, through either explicit HTML references or API calls.
 
 - home/snippets/search.html
 - home/snippets/stats.html
 - home/layout_custom.html
 - snippets/facet_list.html
 - snippets/package_item.html
 - package/snippets/additional_info.html
 

 
