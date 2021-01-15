import multer from 'multer'

export const publicFolder = 'public'
export const uploadSrc = 'avatars'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationFolder = `${publicFolder}/${uploadSrc}`
    cb(null, destinationFolder)
  },
  filename: (req, file, cb) => {
    const filenameParts = file.originalname.split('.')
    const extension = filenameParts[filenameParts.length - 1]
    const avatar = `${req.loggedInUser.id}.${extension}`
    cb(null, avatar)
  },
})
export const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880, // 5MB
  },
})
