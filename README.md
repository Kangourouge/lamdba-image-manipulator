# lamdba-image-manipulator

This package allows you to resize and move images from a source folder to a destination folder in an AWS bucket.

## Installation

```
npm install

rm -rf node_modules/sharp

SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux sharp
```

## AWS

-   Zip the content of the root folder
-   Load the zip file in the AWS lambda console

https://aws.amazon.com/fr/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/

### Lambda configuration

#### Create a lambda fonction

1. Open the [AWS Lambda console](https://console.aws.amazon.com/lambda/home)
2. Choose Create function.

#### Creating an Execution Role in the IAM Console

1. Open the [Roles](https://console.aws.amazon.com/iam/home#/roles) page in the IAM console.

2. Choose Create role.

3. Choose Lambda.

4. Choose Next Step: Permissions.

5. Choose the strategy and add these actions
   ` "s3:PutObject", "s3:DeleteObject", "s3:PutObjectAcl"`

6. Review Policy > Save Changes

#### Add the environment variables to the lambda project

-   UPLOAD_DIR_NAME: Dossier source
-   DEFAULT_MAX_WIDTH: Largeur par défault
-   DEFAULT_MAX_HEIGHT: Largeur par défault

### Création de la fonction de test

1. In the upper right corner, choose Test.

2. On the Configure test event page, select Create new test event and then, under Event template, keep the default Hello World option. Enter an event name and note the following example event template:

```json
{
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "eu-west-3",
            "eventTime": "1970-01-01T00:00:00.000Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "EXAMPLE"
            },
            "requestParameters": {
                "sourceIPAddress": "127.0.0.1"
            },
            "responseElements": {
                "x-amz-request-id": "EXAMPLE123456789",
                "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "testConfigRule",
                "bucket": {
                    "name": "BUCKET_NAME",
                    "ownerIdentity": {
                        "principalId": "EXAMPLE"
                    },
                    "arn": "arn:aws:s3:::BUCKET_NAME"
                },
                "object": {
                    "key": "KEY_OBJECT_FILE",
                    "size": 1024,
                    "eTag": "0123456789abcdef0123456789abcdef",
                    "sequencer": "0A1B2C3D4E5F678901"
                }
            }
        }
    ]
}
```

-   BUCKET_NAME: nom de votre bucket
-   KEY_OBJECT_FILE: clé de l'objet à tester

### Usage

## Format du nom de l'image

Le nom de l'image doit contenir la destination, la largeur et la hauteur.

`D[destination_folder]_W[width_value]_H[height_value]`

La hauteur et la largeur sont optionnels mais attention à bien definir les variables d'environnements.

## Charger l'image dans le dossier destination
