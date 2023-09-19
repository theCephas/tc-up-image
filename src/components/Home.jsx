import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { HashLoader } from "react-spinners";
import Icon from "@mdi/react";
import { mdiImageAutoAdjust } from '@mdi/js';
import { mdiMagnify } from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        const name = user.displayName;
        setUserData({ email, name });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fetchRandomPhotos();
    }, 100);
  }, []);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("savedImages"));
    if (savedImages) {
      setImages(savedImages);
    } else {
      fetchRandomPhotos();
    }
  }, []);

  const API_KEY = "39533503-64bb892cd455bc69d9f1028e5";
  const fetchRandomPhotos = () => {
    const apiUrl = `https://pixabay.com/api/?key=${API_KEY}&per_page=20`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API request failed with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setImages(data.hits);
        // Save images to localStorage
        localStorage.setItem("savedImages", JSON.stringify(data.hits));
      })
      .catch((error) => {
        console.error("Error fetching images from Pixabay:", error);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; // Dragged outside the list, do nothing
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedImages = [...images];
    const [movedItem] = reorderedImages.splice(startIndex, 1);
    reorderedImages.splice(endIndex, 0, movedItem);

    setImages(reorderedImages);

    // Save reordered images to localStorage
    localStorage.setItem("savedImages", JSON.stringify(reorderedImages));
  };

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <Fragment>
      <Helmet>
        <title>Gallery Home</title>
      </Helmet>

      {loading ? (
        <HashLoader
          className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] min-h-screen self-center"
          color="green"
          loading={loading}
          size={70}
        />
      ) : (
        <div>
          {userData ? (
            <div>
              <p>
                Welcome, {userData.name} ({userData.email})
              </p>
              <p className="cursor-pointer" onClick={logOut}>
                Sign Out
              </p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}

          <header className="flex justify-between">
                <div className="flex">
          <Icon path={mdiImageAutoAdjust} size={2} />
          
          <div className="sm:mt-2 sm:ml-3 ">
                    <p className="text-black font-bold hidden sm:contents text-2xl">
                      Image Gallery
                    </p>
                </div>
                </div>
          <form >
                  <div className="relative">
                    <input
                      type="search"
                      
                      name="query"
                      
                      placeholder="Find a photo"
                      className="bg-black/20 sm:w-[25rem] md:w-[28rem] text-white rounded border p-4 text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 ml-[-25px] top-0 "
                    >
                      <Icon className="text-black" path={mdiMagnify} size={1} />
                    </button>
                  </div>
                </form>
                <Icon path={mdiAccount} size={2} />
          </header>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="image-gallery" type="image">
              {(provided) => (
                <div
                  className="mx-8 grid grid-cols-2 sm:grid-cols-3 gap-10"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id.toString()} // Convert image.id to string
                      draggableId={image.id.toString()} // Convert image.id to string
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div>
                            <img src={image.webformatURL} alt={image.tags} />
                            <p>{image.tags}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder} {/* Add the placeholder here */}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </Fragment>
  );
}
