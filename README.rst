=============
ckanext-cd2_theme
=============

Cloned from /data-govt-nz/ckanext-dia_theme and adapted for CD<sup>2</sup>

------------
Requirements
------------

CKAN 2.9.x

------------
Installation
------------

To install the theme:

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


----------------------------------------
CSS Styling
----------------------------------------

Any CSS styling changes should be done in the LESS files and NOT directly in the CSS files. Edit the LESS files and compile to CSS using a LESS compiler, i.e.::

    sudo lessc ckanext/cd2_theme/less/main.less ckanext/cd2_theme/fanstatic/cd2_custom.css


----------------------------------------
Updating and testing
----------------------------------------

SOLR and facet configuration files are included (and config of ckanext-msl-ckan extension), can be written to the correct location using the reload.sh script


----------------------------------------
Specific CD<sup>2</sup> configurations
----------------------------------------

The theme contains functionality with several references to specific elements of the CD<sup>2</sup> meta-data schema, which may cause issues with broader usage. The following pages contain direct references to the CD<sup>2</sup> meta-data schema, through either explicit HTML references or API calls.
 - home/snippets/search.html
 - home/snippets/stats.html
 - home/layout_custom.html
 - snippets/facet_list.html
 - snippets/package_item.html
 - package/snippets/additional_info.html
 
