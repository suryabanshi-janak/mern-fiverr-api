const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Gig = require('../models/Gig');

const createReview = asyncHandler(async (req, res) => {
  if (req.user.isSeller) {
    res.status(403);
    throw new Error('Sellers cannot create a review');
  }

  const gig = await Gig.findById(req.body.gigId);
  if (!gig) {
    res.status(404);
    throw new Error('Gig does not exist');
  }

  const reviewExists = await Review.findOne({
    gigId: req.params.id,
    userId: req.user._id,
  });

  if (reviewExists) {
    res.status(403);
    throw new Error('You have already reviewed this gig');
  }

  await Review.create({
    gigId: req.body.gigId,
    userId: req.user._id,
    star: req.body.star,
    desc: req.body.desc,
  });

  await Gig.findByIdAndUpdate(req.body.gigId, {
    $inc: { totalStars: req.body.star, starNumber: 1 },
  });

  res.status(201).json({ message: 'Review has been created' });
});

const getReviews = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) {
    res.status(404);
    throw new Error('Gig does not exist');
  }

  const review = await Review.find({ gigId: req.params.id });

  res.status(200).json({ data: review });
});

const updateReview = asyncHandler(async (req, res) => {});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(403);
    throw new Error('Review not found');
  }

  await review.deleteOne();
  res.status(200).json({ message: 'Review has been deleted' });
});

module.exports = { createReview, getReviews, updateReview, deleteReview };
