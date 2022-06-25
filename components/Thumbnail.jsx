import Image from "next/image";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/playerAtom";

function Thumbnail({ movie }) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);

  return (
    <div>
      <div
        className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
        onClick={() => {
          setCurrentMovie(movie);
          setShowModal(true);
        }}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${
            movie.backdrop_path || movie.poster_path
          }`}
          className="rounded-sm object-cover md:rounded"
          layout="fill"
        />
        <p className="absolute bottom-3 md:bottom-0 px-2 md:py-3 text-xs md:text-sm ">
          {movie?.title || movie?.original_name}
        </p>
      </div>
    </div>
  );
}

export default Thumbnail;
