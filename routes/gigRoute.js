const express = require('express');
const { authenticateUser } = require('../middleware/authentication');
const {
  getGig,
  getGigs,
  createGig,
  updateGig,
  deleteGig,
} = require('../controllers/gigController');

const router = express.Router();

router
  .route('/')
  .get(authenticateUser, getGigs)
  .post(authenticateUser, createGig);
router
  .route('/:id')
  .get(authenticateUser, getGig)
  .patch(authenticateUser, updateGig)
  .delete(authenticateUser, deleteGig);

module.exports = router;
