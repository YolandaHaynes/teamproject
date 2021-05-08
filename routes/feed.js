const express = require('express')
const router = express.Router()
const feedController = require('../controllers/feed')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureAuth, feedController.getPosts)
router.get('/likedPosts', feedController.getLikedPosts)
router.put('/addLike', feedController.addLike)

module.exports = router