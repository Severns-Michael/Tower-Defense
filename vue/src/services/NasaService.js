import axios from 'axios';

const apiKey = '?api_key=Gt53JZCtJPHVfecMOgQg4n0fRAW64TBPBrydnl4W';


export default {

    getPictureOfTheDay() {
        return axios.get('https://api.nasa.gov/planetary/apod' + apiKey);
    }

}