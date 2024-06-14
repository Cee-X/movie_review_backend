import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let reviews;
export default class ReviewDAO{
    static async injectDb(conn){
            if(reviews){
                return;
            }
            try{
                reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
            }catch(e){  
                console.error(`Unable to connect in ReviewDAO: ${e}`)
            }
     }

    static async getReviews({filters = null, page = 0, reviewsPerPage = 20} = {}){
        let query; 
        if(filters){
            if("movie_id" in filters){
                query = {"movie_id" : { $eq : filters["movie_id"]}}
            }else if("user_id" in filters){
                query = {"user_id" : { $eq : filters["user_id"]}}
            }
        }
        let cursor;
        try{
            cursor = await reviews.find(query).limit(reviewsPerPage).skip(reviewsPerPage * page)
            const reviewsList  = await cursor.toArray();
            const totalNumsReviews = await reviews.countDocuments(query)
            return {reviewsList, totalNumsReviews}
        }catch(e){
            console.error(`Unable to issue find command: ${e}`)
            return {reviewsList : [], totalNumsReviews : 0}
        }
    }

    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name : user.name,
                user_id : user._id,
                date : date,
                review : review,
                movie_id : new ObjectId(movieId)
            }
            return await reviews.insertOne(reviewDoc)
        }catch(e){
            console.error(`Unable to add review: ${e}`)
            return {error: e}
        }
    }  

    static async updateReview(reviewId, userId, review, date) {
        try{
            const updateResponse = await reviews.updateOne(
                { user_id : userId, _id: new ObjectId(reviewId)},
                { $set : {review : review, date : date}}

            )
            return updateResponse
        }catch(e){
            console.error(`Unable to update review: ${e}`)
            return {error: e}
        }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne(
                { _id : new ObjectId(reviewId), user_id : userId}
            )
            return deleteResponse
        }catch(e){
            console.error(`Unable to delete review: ${e}`)
            return {error: e}
        }
    }

    static async getReviewById(id){
        try{
            return await reviews.findOne({_id : new ObjectId(id)})
        }catch(e){
            console.error(`Unable to get review: ${e}`)
            return {error: e}
        }
    }
}