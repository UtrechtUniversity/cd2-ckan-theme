=============
ckanext-cd2_theme
=============

Cloned from /data-govt-nz/ckanext-dia_theme and adapted for CD2

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

     sudo service nginx restart


----------------------------------------
CSS Styling of dia_theme
----------------------------------------

Any CSS styling changes to the dia_theme should be done in the LESS files and NOT directly in the CSS files.

We'll be replacing these styles with the rua pattern library, however for now we have both.

You can use npm to install and build the LESS files with `npm i` and `npm run css`

If you are actively developing/making css changes you can run `npm run css-dev` and the .less files will be automatically compiled on save.

You can use npm to update the rua pattern library styles with `npm run rua`

Alternatively the LESS files were previously compiled with these steps:

 - Install LESS Compiler
 - Make changes in LESS files as required
 - Open console and cd to /path/to/ckanext-cd2_theme
 - Compile the LESS files by running " lessc less/main.less fanstatic/cd2_custom.css "
 - The CSS changes will now show up in the browser

