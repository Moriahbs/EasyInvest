import SmartSearch from "@/components/SmartSearch";
import { useState } from "react";
import { Plus, MessageCircleMore, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";
import TopicsChat from "@/components/TopicsChat";
import { Startup } from "@/models/StartupModel";
import CreateStartupModal from "@/components/CreateStartup";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [dbStartups, setDbStartups] = useState<Startup[]>([]);
  const [openChat, setOpenChat] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openCreateStartup, setOpenCreateStartup] = useState(false);

  const handleCreateStartup = (newStartup: Startup) => {
    setDbStartups([newStartup, ...dbStartups]);
    setOpenCreateStartup(false);
    window.location.href = `${config.CLIENT_URL}/home`;
  };

  return (
    <div className="relative w-full h-[30vh]">
      <img
        src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
        <h1 className="text-4xl font-bold mb-4">Easy Invets</h1>
        <h4 className="text-xl font-bold mb-4">השקעות בפרויקטים מתחילים</h4>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full">
            השקעות
          </button>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full">
            תשקיע
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-2">פרויקטים בשבילך</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 1"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 1</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 2"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 2</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 3"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 3</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 4"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 4</h3>
          </div>
        </div>
      </div>
      <div className="w-full bg-purple-700 py-12 flex justify-around text-white mt-8">
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">+100M</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">325</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">6250</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-36 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-400 border-0 text-white"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-[999]">
            <p>Search Invest with AI</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-400 border-0 text-white"
              onClick={() => setOpenChat(true)}
            >
              <MessageCircleMore className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-[999]">
            <p>Chat with AI</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-400 border-0 text-white"
              onClick={() => setOpenCreateStartup(true)}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-[999]">
            <p>Create Startup</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CreateStartupModal
        open={openCreateStartup}
        setOpen={setOpenCreateStartup}
        onCreate={handleCreateStartup}
      />
      <SmartSearch open={openSearch} setOpen={setOpenSearch} />
      <TopicsChat open={openChat} setOpen={setOpenChat} />
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { isTokenValid } from "@/utils/authUtils";
// import { getAllPosts, getPostsById } from "@/actions/postsActions";
// import Posts from "@/components/Posts";
// import CommentSection from "@/components/Comments";
// import CreatePostModal from "@/components/CreatePost";
// import Paging from "@/components/Paging";
// import { Post } from "@/models/postModel";
// import { getPostFromRestApi } from "@/actions/restPhotos";
// import BasicPost from "@/components/BasicPost";
// import config from "@/config";

// export default function HomePage() {
//   const [openComment, setOpenComment] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [dbPosts, setDbPosts] = useState<Post[]>([]);
//   const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 8;
//   const navigate = useNavigate();

//   useEffect(() => {
//     validateToken();
//   }, [navigate]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const posts = (await getAllPosts()).map((post: Post) => ({
//         ...post,
//         type: "db",
//       }));
//       setDbPosts(posts);
//     };
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     const fetchGeneratedPhotos = async () => {
//       setIsLoading(true);
//       const perPage = Math.max(
//         0,
//         postsPerPage - (dbPosts.length - (currentPage - 1) * postsPerPage)
//       );

//       const newGeneratedPosts = await getPostFromRestApi(perPage, currentPage);

//       setGeneratedPosts(newGeneratedPosts);
//       setIsLoading(false);
//     };

//     fetchGeneratedPhotos();
//   }, [currentPage, dbPosts]);

//   const fetchAndUpdatePost = async (postId: string) => {
//     const updatedPost = await getPostsById(postId);
//     updatedPost.type = "db";
//     setDbPosts((prev) =>
//       prev.map((post) => (post._id === postId ? updatedPost : post))
//     );
//   };

//   const validateToken = () => {
//     const token = Cookies.get("Authorization") || "";
//     if (!isTokenValid(token)) {
//       navigate("/");
//     }
//   };

// const handleCreatePost = (newPost: Post) => {
//   setDbPosts([newPost, ...dbPosts]);
//   setOpenCreate(false);
//   window.location.href = `${config.CLIENT_URL}/home`;
// };

//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const combinedPosts = [...dbPosts, ...generatedPosts].slice(
//     indexOfFirstPost,
//     indexOfLastPost
//   );

//   return (
//     <div className="flex justify-center">
//       <div className="space-y-6 h-full">
//         {isLoading ? (
//           <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
//             <Loader2 className="animate-spin h-12 w-12 text-red-500" />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6">
//             {combinedPosts.map((post, index) =>
//               post.type === "db" ? (
//                 <Posts
//                   key={post._id}
//                   setOpenComment={setOpenComment}
//                   post={post}
//                   fetchAndUpdatePost={fetchAndUpdatePost}
//                 />
//               ) : (
//                 <BasicPost
//                   key={index}
//                   author={post.photographer}
//                   image={post.src.large}
//                   title={post.alt}
//                 />
//               )
//             )}
//           </div>
//         )}
//         {!isLoading && (
//           <Paging
//             totalPages={50}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//           />
//         )}

{
  /* <Button
  className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-400 border-0 text-white"
  // onClick={() => setOpenCreate(true)}
>
  <Plus className="w-6 h-6" />
</Button>;

<CreatePostModal
  open={openCreate}
  setOpen={setOpenCreate}
  onCreate={handleCreatePost}
/>; */
}

//         {openComment && (
//           <CommentSection
//             postId={openComment}
//             setOpen={setOpenComment}
//             fetchAndUpdatePost={fetchAndUpdatePost}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
