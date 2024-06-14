
import ReviewDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

    static async apiGetReview(req, res, next) {
        const reviewsPerPage = req.query.reviewsPerPage ? parseInt(req.query.reviewsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        let filters = {};
        if(req.query.movie_id){
            filters.movie_id = req.query.movie_id;
        }else if(req.query.user_id){
            filters.user_id = req.query.user_id;
        }
        const {reviewsList , totalNumsReviews} = await ReviewDAO.getReviews({filters, page, reviewsPerPage})
        let response = {
            reviews : reviewsList,
            page : page,
            filters : filters,
            entries_per_page : reviewsPerPage,
            total_results : totalNumsReviews
        }
        res.json(response)
    }
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const userInfo = {
                name : req.body.name,
                _id : req.body.user_id
            }
            const date = new Date();

            const ReviewsResponse = await ReviewDAO.addReview(movieId,userInfo,review,date)
            res.json({status: "success"})

        }catch(e){
        
            res.status(500).json({error: e});
        }
    }
    
    static async apiUpdateReview( req, res, next){
        try{
            const reviewId = req.body.review_id
            const review = req.body.review
            const date = new Date()
            const userId = req.body.user_id

            const reviewResponse = await ReviewDAO.updateReview(reviewId, userId, review, date)

            res.json({status : "success"})

        }catch(e){
            res.status(500).json({error: e});
        }
    }
    static async apiDeleteReview(req, res, next){
        try{
            const reviewId = req.body.review_id
            const userId = req.body.user_id
            const reviewResponse = await ReviewDAO.deleteReview(reviewId, userId )
            res.json({status : "success"})
        }catch(e){
            res.status(500).json({error : e})
        }
    }
    static async apiGetReviewById(req, res, next){
        try{
            let id = req.params.id || {}
            let review = await ReviewDAO.getReviewById(id)
            if(!review){
                res.status(404).json({error : "Not found"})
                return
            }
            res.json(review)
        }catch(e){
            console.error(`api, ${e}`)
            res.status(500).json({error : e})
        }
    }

}