import React, { useEffect, useState } from 'react'
import axios from '../axios'
import './Row.css'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

function Row({ title, fetchUrl, isLargeRow}) {
    const base_url = "https://image.tmdb.org/t/p/original/";
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // 
            autoplay: 1
        }
    }

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    console.log(urlParams)
                    setTrailerUrl(urlParams.get('v'));
                }) 
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        async function fetchData() {
            const request  = await axios.get(fetchUrl)
            setMovies(request.data.results)
            return request
        }
        fetchData();
    }, [fetchUrl]) 

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img 
                        key={movie.id}
                        onClick={() => handleClick(movie?.title || movie?.name || movie?.original_name)}
                        className={`row_poster ${isLargeRow && "row_largePoster"}`} 
                        src={`${base_url}${movie.poster_path}`} 
                        alt={movie.name}
                    />
                ))}
            </div>
            {trailerUrl? <YouTube videoId={trailerUrl} opts={opts} /> : <p></p>}
        </div>
    )
}

export default Row

