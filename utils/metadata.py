import datetime
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


def main():
    load_metadata()


def load_metadata(photo_path):
    exif_data = get_exif_data(photo_path)
    lat, lng = get_lat_lon(exif_data)
    caption = get_comment(exif_data)
    dt = get_datetime(exif_data)
    width, height = get_dimensions(photo_path)

    return {
        "lat": str(lat),
        "lng": str(lng),
        "caption": caption,
        "datetime": dt,
        "width": width,
        "height": height,
    }


def _get_if_exist(data, key):
    if key in data:
        return data[key]

    return None


def get_comment(exif_data):
    comment = ' '
    if 'XPComment' in exif_data:
        comment = exif_data['XPComment'].decode('utf-16le').rstrip('\x00')

    return comment


def get_datetime(exif_data):
    dt = None

    if 'DateTimeOriginal' in exif_data:
        dt_string = exif_data['DateTimeOriginal']
        year, month, day = dt_string.split(" ")[0].split(":")
        hour, minute, second = dt_string.split(" ")[1].split(":")
        dt_obj = datetime.datetime(int(year), int(month), int(day), int(hour), int(minute))
        dt = '{:%A %b %d %Y %I:%M %p}'.format(dt_obj)

    if dt:
        return dt


def get_dimensions(photo_path):
    im = Image.open(photo_path)
    width, height = im.size
    width, height = str(width), str(height)
    return width, height


def get_exif_data(fn):
    """Returns a dictionary from the exif data of an PIL Image item. Also converts the GPS Tags"""
    image = Image.open(fn)

    exif_data = {}
    info = image._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]

                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value

    return exif_data


def _convert_to_degrees(value):
    """Helper function to convert the GPS coordinates stored in the EXIF to degrees in float format"""
    d0 = value[0][0]
    d1 = value[0][1]
    d = float(d0) / float(d1)

    m0 = value[1][0]
    m1 = value[1][1]
    m = float(m0) / float(m1)

    s0 = value[2][0]
    s1 = value[2][1]
    s = float(s0) / float(s1)

    return d + (m / 60.0) + (s / 3600.0)


def get_lat_lon(exif_data):
    """Returns the latitude and longitude, if available, from the provided
    exif_data (obtained through get_exif_data above)"""
    lat = None
    lon = None

    if "GPSInfo" in exif_data:
        gps_info = exif_data["GPSInfo"]

        gps_latitude = _get_if_exist(gps_info, "GPSLatitude")
        gps_latitude_ref = _get_if_exist(gps_info, 'GPSLatitudeRef')
        gps_longitude = _get_if_exist(gps_info, 'GPSLongitude')
        gps_longitude_ref = _get_if_exist(gps_info, 'GPSLongitudeRef')

        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = _convert_to_degrees(gps_latitude)
            if gps_latitude_ref != "N":
                lat = 0 - lat

            lon = _convert_to_degrees(gps_longitude)
            if gps_longitude_ref != "E":
                lon = 0 - lon

    return lat, lon


if __name__ == '__main__':
    main()
