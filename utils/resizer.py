import os
import shutil
from PIL import Image
import piexif


def main():
    """A utility for resizing photos"""
    thumbnail_size = (80, 80)
    popup_size = (640, 640)
    photo_dir = r'C:\photo\dir'

    photos = [
        os.path.join(photo_dir, f)
        for f in os.listdir(photo_dir)
        if f.endswith(('jpg', 'jpeg', 'JPG', 'JPEG'))
    ]

    for photo in photos:
        copy_and_resize_photo(photo, prefix="popup", size=popup_size)
        copy_and_resize_photo(photo, prefix="thumbnail", size=thumbnail_size)


def copy_and_resize_photo(photo_path, prefix="thumbnail", size=(80, 80)):
    """Create an appropriately named copy (thumbnail or popup), and 
    return the path to the copy."""
    folder, base = os.path.split(photo_path)
    copy_path = os.path.join(folder, prefix + "_" + base)

    # copy metadata from the original
    im = Image.open(photo_path)
    exif_dict = piexif.load(im.info['exif'])
    exif_bytes = piexif.dump(exif_dict)
    im.close()

    # make a copy
    shutil.copy2(photo_path, copy_path)

    # resize copy
    im = Image.open(copy_path)
    im.thumbnail(size, Image.LANCZOS)
    im.save(copy_path, "jpeg", exif=exif_bytes)
    im.close()


if __name__ == '__main__':
    main()
