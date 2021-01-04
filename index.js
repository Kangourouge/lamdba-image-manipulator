const async = require('async')
const AWS = require('aws-sdk')
const sharp = require('sharp')
const s3 = new AWS.S3()
const utility = require('./utility.js')

const extentionRegex = /\.[^.]*$/gi
const uploadDirName = process.env.UPLOAD_DIR_NAME
const defaultMaxWidth = process.env.DEFAULT_MAX_WIDTH
const defaultMaxHeight = process.env.DEFAULT_MAX_HEIGHT

exports.handler = async (event, context, callback) => {
    utility.init(event.Records[0].s3)

    let destination = getValueByPrefixer(utility.fileName, 'D')

    if (destination == null) callback('The destination folder is not defined')

    var width = getValueByPrefixer(utility.fileName, 'W')
    var height = getValueByPrefixer(utility.fileName, 'H')

    width = width !== null ? parseInt(width) : defaultMaxWidth
    height = height !== null ? parseInt(height) : defaultMaxHeight

    if (uploadDirName !== utility.uploadDirName) {
        callback('Ignore other dir than upload dir.')

        return
    }

    if (uploadDirName === destination) {
        callback('Source and destination buckets/keys are the same.')

        return
    }

    let typeMatch = utility.fileName.match(extentionRegex)

    if (!typeMatch) {
        callback('Could not determine the image type.')
    }

    let imageType = typeMatch[0].toLowerCase()

    if (imageType !== '.jpg' && imageType !== '.png' && imageType !== '.jpeg') {
        callback(`Unsupported image type: ${imageType}`)

        return
    }

    try {
        const params = {
            Bucket: utility.bucketName,
            Key: utility.uploadPath,
        }
        var origimage = await s3.getObject(params).promise()
    } catch (error) {
        console.log(error)
        return
    }

    console.log('downloaded')

    try {
        var buffer = await sharp(origimage.Body).resize(width, height).toBuffer()
    } catch (error) {
        console.log(error)
        return
    }

    try {
        const params = {
            Bucket: utility.bucketName,
            Key: utility.buildDestinationPath(destination),
            Body: buffer,
            ContentType: 'image/' + imageType.replace('.', ''),
            ACL: utility.bucketName === 'krg.test' ? 'public-read' : 'authenticated-read',
        }

        const putResult = await s3.putObject(params).promise()
    } catch (error) {
        console.log(error)
        return
    }

    try {
        const params = {
            Bucket: utility.bucketName,
            Key: utility.uploadPath,
        }

        const deleteResult = await s3.deleteObject(params).promise()
    } catch (error) {
        console.log(error)
        return
    }

    console.log('Success')
}

const getValueByPrefixer = (fileName, prefix) => {
    const names = fileName.split('_')

    if (names.length < 2) return null

    for (var i = 0; i < names.length - 1; i++) {
        if (prefix === names[i].substr(0, 1)) return names[i].substr(1, names[i].length)
    }

    return null
}
