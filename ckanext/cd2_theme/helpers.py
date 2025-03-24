from ckan.common import config
import ckan.logic as logic
import ckan.plugins.toolkit as toolkit
import urllib.request
import json 


def parent_site_url():
    """
    Return the URL of the parent site (eg, if this instance
    is running in a CKAN + CMS config). Returns the setting
    ckan.parent_site_url, or value of h.url('home') if that
    setting is missing
    """
    return config.get('ckan.parent_site_url', toolkit.h.url_for('home.index'))


def modify_geojson(geojson_string):
    """
    Returns 'fixed' geojson if the input is a Polygon or MultiPolygon type.
    Valid geojson should be within the -180, 180 range, but for most datasets
    this will render a very zoomed out view of the map. Instead, we map
    latitudes under 0th meridian to be +360, which makes the map look a lot
    nicer for most polygons that span the 180th meridian.

    :param geojson_string:
    :return:
    """
    obj = json.loads(geojson_string)

    if isinstance(obj, dict):
        new_coords = []
        if obj.get('type', None) == 'Polygon':
            for shape in obj.get('coordinates'):
                new_coords.append([_modify(c) for c in shape])
        elif obj.get('type', None) == 'MultiPolygon':
            for shape in obj.get('coordinates'):
                new_coords.append([[_modify(c) for c in shape[0]]])
        else:
            return geojson_string

        obj['coordinates'] = new_coords
        return json.dumps(obj)
    else:
        return geojson_string


def _modify(coord):
    lat, long = coord
    if lat < 0:
        lat = lat + 360
    return [lat, long]


def get_site_statistics():
    # TODO this was copied from ckan core helpers. It will be added back
    # in a future version of ckan 2.11, at which time we should remove
    # this helper again and use that one.
    # see: https://github.com/ckan/ckan/issues/8522
    stats = {}
    stats['dataset_count'] = logic.get_action('package_search')(
        {}, {"rows": 1})['count']
    stats['group_count'] = len(logic.get_action('group_list')({}, {}))
    stats['organization_count'] = len(
        logic.get_action('organization_list')({}, {}))
    return stats
