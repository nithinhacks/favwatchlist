import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import MuiModal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, movieState, playlistState } from "../atoms/playerAtom";
import ReactPlayer from "react-player/lazy";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Player() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState([]);
  const [muted, setMuted] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [movies, setMovies] = useRecoilState(playlistState);
  const { data: session } = useSession();

  const handleClose = () => {
    setShowModal(false);
    setMovie(null);
  };

  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((response) => response.json());
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element) => element.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
    }

    fetchMovie();
  }, [movie]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const { data } = await axios.get("/api/playlist");
        const a = data.map((movie) => movie.movie);
        setMovies(a);
      } catch (e) {
        console.log(e);
      }
    }
    fetchMovies();
  }, [movie, movies]);

  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.id === movie?.id) !== -1
      ),
    [movies]
  );

  const handleList = async () => {
    setAddedToList(!addedToList);
    if (addedToList) {
      toast(
        `${
          movie?.title || movie?.original_name
        } has been removed from My List.`,
        {
          icon: "✔",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 5000,
        }
      );
      try {
        await axios.delete(`/api/playlist/${movie?.id}`);
      } catch (e) {
        console.log(e);
      }
    } else {
      toast(
        `${movie?.title || movie?.original_name} has been added to My List.`,
        {
          icon: "✔",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 5000,
        }
      );
      const addmovie = { user: session.user.uid, movie: movie };
      try {
        await axios.post("/api/playlist", addmovie);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818] "
        >
          <XIcon className="h-6 w-6" />
        </button>
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
            controls={true}
          />
        </div>
        <div>
          <div className="absolute bottom-45 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2 pt-3">
              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton">
                <ThumbUpIcon className="h-6 w-6" />
              </button>
            </div>
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-6 w-6" />
              ) : (
                <VolumeUpIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="flex space-x-16 pt-12 rounded-b-md bg-[#181818] px-10 py-8">
            <div className="space-y-6 text-lg">
              <div className="flex items-center pt-2 space-x-2 text-sm">
                <p className="font-semibold text-green-400">
                  {movie.vote_average * 10}% Match
                </p>
                <p className="font-light">
                  {movie?.release_date || movie?.first_air_date}
                </p>
                <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                  HD
                </div>
              </div>
              <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                <p className="w-5/6 text-base md:text-lg">{movie?.overview}</p>
                <div className="flex flex-col space-y-3 text-sm">
                  <div>
                    <span className="text-[gray]">Genres:</span>{" "}
                    {genres.map((genre) => genre.name).join(", ")}
                  </div>

                  <div>
                    <span className="text-[gray]">Original language:</span>{" "}
                    {movie?.original_language}
                  </div>

                  <div>
                    <span className="text-[gray]">Total votes:</span>{" "}
                    {movie?.vote_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
}

export default Player;
