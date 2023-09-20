import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { BounceLoader } from "react-spinners";
import Icon from "@mdi/react";
import {
  mdiEmailOutline,
  mdiGithub,
  mdiImageAutoAdjust,
  mdiLinkedin,
  mdiPhoneOutline,
  mdiTwitter,
} from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { mdiMagnify } from "@mdi/js";
import {
  motion,
  useCycle,
  AnimatePresence,
} from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [term, setTerm] = useState("");

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
//       fetchRandomPhotos();
    }, 5000);
  }, []);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("savedImages"));
    if (savedImages) {
      setImages(savedImages);
    }
  }, []);

  useEffect(() => {
    fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${term}&tags=photo&pretty=true`
    )
      .then((res) => res.json())
      .then((data) => {
        setImages(data.hits);
        localStorage.setItem("savedImages", JSON.stringify(data.hits));
      })
      .catch((err) => console.log(err));
  }, [term]);

  const API_KEY = "39533503-64bb892cd455bc69d9f1028e5";

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedImages = [...images];
    const [movedItem] = reorderedImages.splice(startIndex, 1);
    reorderedImages.splice(endIndex, 0, movedItem);

    setImages(reorderedImages);

    // Save reordered images to local storage
    localStorage.setItem("savedImages", JSON.stringify(reorderedImages));
  };

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const [mobileNav, toggleMobileNav] = useCycle(false, true);

  return (
    <Fragment>
      <Helmet>
        <title>Gallery Home</title>
      </Helmet>

      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
        }}
        className="text-white min-h-screen"
      >
        {loading ? (
                <div className="absolute top-[40%] left-[50%] transform translate-x-[-50%] translate-y-[0%]">
          <BounceLoader
            className=" min-h-screen"
            color="white"
            loading={loading}
            size={70}
          />
          </div>
        ) : (
          <div>
            <header className="flex justify-between font-bodyFont py-4 px-4 mb-10 border-b border-white/40 w-full">
              <div className="flex">
                <Link to="/Home">
                <Icon path={mdiImageAutoAdjust} size={2} />

                <div className="sm:mt-2 sm:ml-3 ">
                  <p className="text-white font-bold hidden md:contents text-2xl">
                    Image Gallery
                  </p>
                </div> 
                </Link>
              </div>
              <form>
                <div className="relative mx-4">
                  <input
                    type="search"
                    name="search"
                    id=""
                    placeholder="Find a photo"
                    className="bg-black/10 w-[150px] sm:w-[25rem] md:w-[28rem] text-white rounded border border-black/10 p-4 text-sm"
                    onChange={(e) => setTerm(e.target.value)}
                  />
                  <p
                    className="absolute inset-y-0 cursor-pointer right-0 mr-2 mt-4 ml-[-25px] top-0 "
                  >
                    <Icon className="text-white" path={mdiMagnify} size={1} />
                  </p>
                </div>
              </form>
              <div className="relative z-10">
                <motion.button
                  animate={mobileNav ? "open" : "close"}
                  onClick={() => toggleMobileNav()}
                  className="flex flex-col space-y-1 mt-6"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0, transition: { duration: 1 } },
                      open: { rotate: 45, y: 5, transition: { duration: 1 } },
                    }}
                    className="w-5 sm:w-9 h-px bg-white block"
                  ></motion.span>
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="w-5 sm:w-9 h-px bg-white block"
                  ></motion.span>
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -5 },
                    }}
                    className="w-5 sm:w-9 h-px bg-white block"
                  ></motion.span>
                </motion.button>
              </div>
              <AnimatePresence>
                {mobileNav && (
                  <motion.div
                    key="mobile-nav"
                    className="fixed inset-0 text-white"
                    style={{
                      background:
                        "linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%)",
                    }}
                    variants={{
                      open: {
                        x: "0%",
                      },
                      closed: {
                        x: "-100%",
                        transition: {
                          duration: 0.2,
                        },
                      },
                    }}
                    animate="open"
                    initial="closed"
                    exit="closed"
                  >
                    {userData ? (
                      <motion.div>
                        <p className="text-xl mt-8 ml-4 sm:ml-8">
                          Image Gallery
                        </p>
                        <div className="flex flex-col items-center mt-20 mx-4">
                          <Icon
                            path={mdiAccount}
                            className="sm:w-[300px] w-[280px] text-black"
                          />

                          <div className="py-4 text-sm sm:text-xl">
                            <p className="pb-4">{userData.name}</p>
                            <p> {userData.email}</p>
                          </div>
                          <p
                            className="cursor-pointer mt-4 bg-black/30 hover:duration-700 hover:bg-black/50 p-4 px-8 rounded-xl text-white/80"
                            onClick={logOut}
                          >
                            Sign Out
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <p className="text-center mt-[50%] text-2xl font-bold font-mooli">
                        Not logged in...
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </header>
            {!loading && images.length === 0 && (
              <div className="min-h-screen text-center text-2xl font-bold font-mooli">
                <h1>No results found...</h1>
              </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="image-gallery" type="image">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {loading ? (
                      <div className="min-h-screen text-center text-2xl font-bold font-mooli">
                        <h1>Loading...</h1>
                      </div>
                    ) : (
                      <main className="mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {images.slice(0, 12).map((image, index) => (
                          <Draggable
                            key={image.id.toString()}
                            draggableId={image.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="">
                                  <img
                                    className="rounded-t shadow-lg"
                                    src={image.webformatURL}
                                    alt={image.tags}
                                  />
                                  <p className="text-sm rounded-b font-bodyFont bg-white/20 text-white px-4 py-4 w-full h-[50px] bottom-0">
                                    Tags:{" "}
                                    <span className="text-black font-bold">
                                      {" "}
                                      {image.tags}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </main>
                    )}
                    {provided.placeholder}

                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <footer
          className={`flex justify-between duration-700 text-[10px] p-6 px-6 md:px-10 mt-10 border-t border-t-white`}
        >
          <div className="flex">
            <p className={`pr-2 text-black`}>
              &copy;2023
            </p>
            <a
              href="https://github.com/theCephas"
              className="inline cursor-pointer text-sky-500 "
            >
              Osho Iseoluwa
            </a>
          </div>
          <div className={` text-black flex mt-[-4px]`}>
            <a
              className=" hover:text-sky-500 duration-700"
              href="https://www.linkedin.com/in/iseoluwa-osho"
            >
              <Icon path={mdiLinkedin} size={1} />
            </a>
            <a
              className="px-4 hover:text-sky-500 duration-700"
              href="mailto:oshoiseoluwa@gmail.com"
            >
              <Icon path={mdiEmailOutline} size={1} />
            </a>
            <a
              className=" hover:text-sky-500 duration-700"
              href="tel:+2348110470908"
            >
              <Icon path={mdiPhoneOutline} size={1} />
            </a>
            <a
              className="px-4 hover:text-sky-500 duration-700"
              href="https://github.com/theCephas"
            >
              <Icon path={mdiGithub} size={1} />
            </a>
            <a
              className=" hover:text-sky-500 duration-700"
              href="https://twitter.com/OshoIseoluwa"
            >
              <Icon path={mdiTwitter} size={1} />
            </a>
          </div>
        </footer>
          </div>
        )}
        
      </div>
    </Fragment>
  );
}
