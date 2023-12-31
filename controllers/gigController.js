const asyncHandler = require('express-async-handler');
const Gig = require('../models/Gig');

const getGigs = asyncHandler(async (req, res) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: 'i' } }),
  };

  const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });

  res.status(200).json({ data: gigs });
});

const getGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  res.status(200).json({ data: gig });
});

const createGig = asyncHandler(async (req, res) => {
  if (!req.user.isSeller) {
    res.status(403);
    throw new Error('Only sellers can create a gig');
  }

  const gig = await Gig.create({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json({ message: 'Gig created successfully', data: gig });
});

const updateGig = asyncHandler(async (req, res) => {});

const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!gig) {
    res.status(403);
    throw new Error('You can only delete gigs that you have created');
  }

  await gig.deleteOne();

  res.status(200).json({ message: 'Gig has been deleted!' });
});

module.exports = { getGig, getGigs, createGig, updateGig, deleteGig };
