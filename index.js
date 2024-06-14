import app from './server.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import MovieDAO from './dao/moviesDAO.js';
import ReviewDAO from './dao/reviewsDAO.js';
async function main(){
    dotenv.config();
    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URL
        );
    const port = process.env.PORT || 8000;
    try{
        await client.connect();
        await MovieDAO.injectDB(client);
        await ReviewDAO.injectDb(client);
        app.listen(port, () =>{
            console.log('server is running on port: ' + port)
        })

    }catch(e){
        console.error(e);
        process.exit(1);
    }
}
main().catch(console.error)