module.exports = {
  bucketName: null,
  uploadPath: null,
  basePath: '',
  uploadDirName: null,
  fileName: null,
  init: function (s3eventRecord) {
    this.bucketName = s3eventRecord.bucket.name
    // Sanitize key
    this.uploadPath = decodeURIComponent(s3eventRecord.object.key.replace(/\+/g, " "))
    let pathKeys = this.uploadPath.split('/')
    this.fileName = pathKeys.pop()
    this.uploadDirName = pathKeys.pop()
    this.basePath = pathKeys.join('/')
  },
  buildDestinationPath: function(destination) {
      return (this.basePath !== '' ? this.basePath+'/' : '') + destination + '/' + this.fileName
  }
};
