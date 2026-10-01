const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { put, del } = require('@vercel/blob')

const router = express.Router()

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads')

// Vercel rejects request bodies larger than 4.5MB
const MAX_FILE_SIZE = 4 * 1024 * 1024

const useBlobStorage = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

const sanitizeSegment = (value, fallback) => {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9._ -]/g, '')
    .replace(/\.\.+/g, '.')
    .trim()

  return cleaned || fallback
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
})

const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File is too large. Maximum size is 4MB',
      })
    }

    if (error) {
      return next(error)
    }

    next()
  })
}

router.post('/', handleUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File is required',
    })
  }

  try {
    const folder = sanitizeSegment(req.body.uploadFolder, 'common')
    const filename = sanitizeSegment(req.body.filename || path.parse(req.file.originalname).name, 'file')
    const extension = path.extname(req.file.originalname)
    const storedName = `${filename}-${Date.now()}${extension}`

    let filePath

    if (useBlobStorage()) {
      const blob = await put(`uploads/${folder}/${storedName}`, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
        addRandomSuffix: true,
      })

      filePath = blob.url
    } else {
      const uploadPath = path.join(UPLOADS_DIR, folder)

      fs.mkdirSync(uploadPath, { recursive: true })
      fs.writeFileSync(path.join(uploadPath, storedName), req.file.buffer)

      filePath = `/uploads/${folder}/${storedName}`
    }

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filePath,
    })
  } catch (error) {
    console.error('Upload Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message,
    })
  }
})

// ===============================
// DELETE - IMAGE
// ===============================

router.delete('/', async (req, res) => {
  try {
    const { filePath } = req.body

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'filePath is required',
      })
    }

    if (/^https?:\/\//.test(filePath)) {
      if (useBlobStorage()) {
        await del(filePath)
      }

      return res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      })
    }

    const relativePath = filePath.replace(/^\/uploads[\\/]/, '')
    const uploadPath = path.resolve(UPLOADS_DIR, relativePath)

    // Files bundled with the deployment are read-only on Vercel, and paths must stay inside uploads/
    if (!uploadPath.startsWith(UPLOADS_DIR) || process.env.VERCEL || !fs.existsSync(uploadPath)) {
      return res.status(200).json({
        success: true,
        message: 'File not found, but delete skipped',
      })
    }

    fs.unlinkSync(uploadPath)

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message,
    })
  }
})

module.exports = router
