import MovieDAO from "../dao/moviesDAO.js";

export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage? parseInt(req.query.moviesPerPage, 10) : 20;
        const page = req.query.page? parseInt(req.query.page, 10) : 0;
        let filters = {};
        if(req.query.rated){
            filters.rated = req.query.rated;
        }else if(req.query.title){
            filters.title = req.query.title;
        }
        const { moviesList, totalNumMovies } = await MovieDAO.getMovies({filters, page, moviesPerPage});

        let response = {
            movies : moviesList,
            page : page,
            filters : filters,
            entries_per_page : moviesPerPage,
            total_results : totalNumMovies
        }

        res.json(response)
    }

    static async apiGetMoviesById(req, res, next){
        try{
            let id = req.params.id || {};
            let movie = await MovieDAO.getMovieById(id);
            if(!movie){
                res.status(404).json({error : "Not found"})
                return
            }
            res.json(movie)
        }catch(err){
            res.status(500).json({error : err})
        }
    }
    
    static async apiGetMoviesByRating(req, res, next){
        try{
            let propertyType = await MovieDAO.getRating(); 
            res.json(propertyType)
        }catch(err){
            res.status(500).json({error : err})
        }
    }
}