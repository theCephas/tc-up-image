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
import { motion, useCycle, AnimatePresence } from "framer-motion";
import { data } from "./data";
import { DndContext,
        closestCenter,
        useSensors,
        KeyboardSensor,
        MouseSensor,
        TouchSensor,
        useSensor, } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(data);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

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
    }, 5000);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const [mobileNav, toggleMobileNav] = useCycle(false, true);

  // Filter the images based on the search term
  const filteredImages = images.filter((image) =>
    image.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!active || active.id === over.id) {
      return;
    }

    setImages((images) => {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      return arrayMove(images, oldIndex, newIndex);
    });
  };
  const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
          activationConstraint: { delay: 50, tolerance: 10 },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
      )
  const SortableUser = ({ image }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: image.id });

    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={image.id}
      >
        <div className="m-auto w-[300px]">
          <img
            className="rounded-t shadow-lg w-[300px] h-[200px]"
            src={image.src}
            alt={image.alt}
          />
          <p className="text-sm rounded-b font-bodyFont w-[300px] bg-white/20 text-white px-4 py-4 h-[50px] bottom-0">
            #<span className="text-black font-bold">{image.tags}</span>
          </p>
        </div>
      </div>
    );
  };
  SortableUser.propTypes = {
    image: PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    }).isRequired,
  };
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
          <div className="absolute top-[40%] min-h-screen left-[50%] transform translate-x-[-50%] translate-y-[0%]">
            <BounceLoader
              className=""
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
              <form onSubmit={handleSearchSubmit}>
                <div className="relative mx-4">
                  <input
                    type="search"
                    name="search"
                    id=""
                    placeholder="Find a photo by tag"
                    className="bg-black/10 w-[150px] sm:w-[25rem] md:w-[28rem] text-white rounded border border-black/10 p-4 text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <p className="absolute inset-y-0 cursor-pointer right-0 mr-2 mt-4 ml-[-25px] top-0 ">
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

                          <div className="py-4 text-sm text-center sm:text-xl">
                            <p className="pb-4 text-center">{userData.name}</p>
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
            {!loading && filteredImages.length === 0 && (
              <div className="min-h-screen text-center text-2xl font-bold font-mooli">
                <h1>No results found...</h1>
              </div>
            )}

            <div>
              {loading ? (
                <div className="min-h-screen text-center text-2xl font-bold font-mooli">
                  <h1>Loading...</h1>
                </div>
              ) : (
                <main className="mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                    sensors={sensors}
                  >
                    <SortableContext items={images}>
                      {filteredImages.map((image, index) => (
                        <SortableUser key={index} image={image} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </main>
              )}
            </div>

            <footer
              className={`flex justify-between duration-700 text-[10px] p-6 px-6 md:px-10 mt-10 border-t border-t-white`}
            >
              <div className="flex">
                <p className={`pr-2 text-black`}>&copy;2023</p>
                <a
                  href="https://github.com/theCephas/tc-up-image"
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
