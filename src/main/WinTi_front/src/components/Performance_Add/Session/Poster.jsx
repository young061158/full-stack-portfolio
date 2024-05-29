import React, { useState, useEffect } from "react";
import ModalActAndPoster from "../modal/ActorAndPoster/ModalActAndPoster.tsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";

const Poster = ({ setPosterPath, setActorInfo, posterPath, actorInfo }) => {
  const { modifyShowId } = useParams();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentImageIndex(newIndex),
  };

  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadImages = () => {
    const loadedImages = [];

    // 등록 부분
    if (modifyShowId == null) {
      posterPath.forEach((poster) => {
        if (poster == null) {
          return;
        }
        if (poster.poster instanceof File) {
          const reader = new FileReader();
          reader.onload = (event) => {
            loadedImages.push({ imagePath: event.target.result });
            setImages([...loadedImages]);
          };
          if (modifyShowId == null) {
            reader.readAsDataURL(poster.poster);
          }
        } else {
          loadedImages.push({ imagePath: poster.poster });
          setImages([...loadedImages]);
        }
      });

      // Processing actorInfo
      actorInfo.forEach((actor) => {
        if (actor.actorPath instanceof File) {
          const reader = new FileReader();
          reader.onload = (event) => {
            loadedImages.push({ imagePath: event.target.result });
            setImages([...loadedImages]);
          };
          if (modifyShowId == null) {
            reader.readAsDataURL(actor.actorPath);
          }
        } else {
          loadedImages.push({ imagePath: actor.actorPath });
          setImages([...loadedImages]);
        }
      });

      // 수정 부분
    } else {
      posterPath.forEach((poster) => {
        if (poster !== null) {
          loadedImages.push({ imagePath: poster });
        }
      });
      actorInfo.forEach((actor) => {
        if (actor !== null) {
          loadedImages.push({ imagePath: actor.actorPath });
        }
      });

      setImages(loadedImages);
    }
  };

  const handleShowModal = () => {
    if (!saved) {
      setShowModal(false);
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
    loadImages();
  }, [posterPath, actorInfo]);

  return (
    <div className="poster-container">
      <div className="posterImages">
        <Slider {...settings}>
          {images.length >= 2 &&
            images.map((image, index) => (
              <div key={index} className="posterImage">
                {modifyShowId != null ? (
                  <img
                    src={"http://localhost:8080" + image.imagePath}
                    alt={image.imagePath}
                  />
                ) : (
                  <img src={image.imagePath} alt={`Image ${index}`} />
                )}
              </div>
            ))}
        </Slider>
      </div>
      {!modifyShowId && (
        <button className="button-cast-registration" onClick={handleShowModal}>
          포스터 및 출연진 등록
        </button>
      )}
      {showModal && (
        <ModalActAndPoster
          setShowModal={setShowModal}
          setPosterPath={setPosterPath}
          setActorInfo={setActorInfo}
        />
      )}
    </div>
  );
};

export default Poster;
