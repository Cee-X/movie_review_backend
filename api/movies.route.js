import MoviesController from './moviesController.js'
import express from 'express';
import ReviewsController from './reviewsController.js';

const router = express.Router();
router.route('/').get(MoviesController.apiGetMovies);
router.route('/id/:id').get(MoviesController.apiGetMoviesById);
router.route('/rating').get(MoviesController.apiGetMoviesByRating);
router.route('/review')
    .get(ReviewsController.apiGetReview)
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)
router.route('/review/:id').get(ReviewsController.apiGetReviewById);
export default router;