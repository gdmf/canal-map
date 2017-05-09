# assumes credential file in .aws folder in user directory
import json
import os
import boto3
import metadata

s3 = boto3.resource('s3')


def main():
    bucket_name = 'canal-photos'
    bucket_region = 'us-west-1'
    bucket = s3.Bucket(bucket_name)
    photo_directory = r'C:\photo\directory'

    # upload_photos(photo_directory, bucket)
    # download_photos(photo_directory, bucket)
    # delete_all_keys(bucket)
    metadata_from_bucket(bucket, bucket_region)


def metadata_from_bucket(bucket, region):

    data = {'rows': []}
    rows = []

    client = boto3.client('s3', region)

    for key in bucket.objects.filter(Prefix='thumbnail'):
        obj = key.Object()
        thumbnail_url = "{}/{}/{}".format(
            client.meta.endpoint_url, bucket.name, key.key
        )
        url = thumbnail_url.replace("thumbnail", "popup")

        d = {
            'lat': obj.metadata['lat'],
            'lng': obj.metadata['lng'],
            'caption': obj.metadata['caption'],
            'thumbnail': thumbnail_url,
            'url': url,
            'video': '',
        }
        rows.append(d)
    data['rows'] = rows
    print(json.dumps(data))


def upload_photos(photo_directory, bucket):
    """Upload a directory of files to an s3 bucket. Check for existence
    of key before uploading each file."""
    photos = [
        os.path.join(photo_directory, f)
        for f in os.listdir(photo_directory)
        if f.endswith(('jpg', 'jpeg', 'JPG', 'JPEG'))
    ]

    keys = [obj.key for obj in bucket.objects.all()]

    for photo in photos:
        photo_name = os.path.basename(photo)

        if photo_name not in keys:
            data = open(photo, 'rb')
            photo_metadata = metadata.load_metadata(photo)

            bucket.put_object(
                ACL='public-read',
                Key=photo_name,
                Metadata=photo_metadata,
                Body=data,
            )

            print("{} uploaded".format(photo_name))

    size = sum(1 for _ in bucket.objects.all())
    print("{} contains {} photos".format(bucket.name, size))


def download_photos(photo_directory, bucket):
    """Download all files from an s3 bucket to a local directory. Check for
    existence of local file before downloading each file."""
    photos = [
        f for f in os.listdir(photo_directory)
        if f.endswith(('jpg', 'jpeg', 'JPG', 'JPEG'))
    ]

    keys = [obj.key for obj in bucket.objects.all()]

    for key in keys:
        if key not in photos:
            filename = os.path.join(photo_directory, key)
            bucket.download_file(key, filename)
            print("{} downloaded".format(key))


def delete_all_keys(bucket):
    """Delete all keys from an s3 bucket."""
    for key in bucket.objects.all():
        key.delete()
        print("{} deleted".format(key.key))


if __name__ == '__main__':
    main()
