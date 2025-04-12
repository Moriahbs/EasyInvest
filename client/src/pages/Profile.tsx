import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadProfile from "@/components/UploadProfile";
import { Label } from "@/components/ui/label";
import { getUser, updateUser, getAllUsers } from "@/actions/profileActions";
import Cookies from "js-cookie";
import { isTokenValid } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import {
//   deletePost,
//   getPostsById,
//   getPostsBySender,
// } from "@/actions/postsActions";
// import Posts from "@/components/Posts";
// import CommentSection from "@/components/Comments";
// import Paging from "@/components/Paging";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoreVertical } from "lucide-react";
// import EditPostModal from "@/components/EditPost";
// import { Post } from "@/models/postModel";

interface User {
  username: string;
  email: string;
  password: string;
  profilePhotoUrl: string;
}

const initialUser: User = {
  username: "",
  email: "",
  password: "",
  profilePhotoUrl: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(initialUser);
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [newEmail, setNewEmail] = useState<string>(user.email);
  const [image, setImage] = useState<File | null>(null);
  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [allEmails, setAllEmails] = useState<string[]>([]);
  // const [, setUserPosts] = useState<Post[]>([]);
  // const [openComuserPostsment, setOpenComment] = useState<string | null>(null);
  // const [openEdit, setOpenEdit] = useState<string | null>(null);
  // const [currentPage, setCurrentPage] = useState(1);

  // const postsPerPage = 5;
  const token = Cookies.get("Authorization") || "";

  // const fetchPosts = async () => {
  //   const userPosts = await getPostsBySender(token);
  //   setUserPosts(userPosts);
  // };

  useEffect(() => {
    validateToken();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
      // await fetchPosts();
      const allUsers = await getAllUsers();

      const allUsernames = allUsers.map((user: User) => user.username);
      const allEmails = allUsers.map((user: User) => user.email);

      setAllUsernames(
        allUsernames.filter((name: string) => name !== user.username)
      );
      setAllEmails(allEmails.filter((email: string) => email !== user.email));
    };
    fetchData();
  }, []);

  const validateToken = () => {
    if (!isTokenValid(token)) {
      navigate("/");
    }
  };

  const getUserDetails = async () => {
    const currentUser = await getUser(token);
    const { username, email, password, profilePhoto } = currentUser.data;
    setUser({ username, email, password, profilePhotoUrl: profilePhoto });
  };

  // const fetchAndUpdatePost = async (postId: string) => {
  //   const updatedPost = await getPostsById(postId);

  //   setUserPosts((prev) =>
  //     prev.map((post) => (post._id === postId ? updatedPost : post))
  //   );
  // };

  const handleSave = () => {
    try {
      if (newUsername || image) {
        updateUser(token, newUsername, image);
        getUserDetails();
        toast.success("השינויים נשמרו בהצלחה");
      } else {
        toast.info("לא התבצעו שינויים");
      }
    } catch (error) {
      toast.error("קרתה שגיאה בשמירת השינויים");
    }
  };

  // const handleDeletePost = async (postId: string) => {
  //   await deletePost(postId);
  //   await fetchPosts();
  // };

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="p-6 space-x-8 flex h-fit w-full justify-around">
      <Card className="h-fit w-1/2">
        <CardHeader className="items-center">
          <CardTitle className=" text-xl p-1">פרופיל אישי</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3 justify-around">
          <UploadProfile
            username={user.username}
            setImage={setImage}
            imageUrl={user.profilePhotoUrl}
            isRegister={false}
          />
          <div className="space-y-4 w-1/2">
            <div>
              <Label htmlFor="username">שם משתמש</Label>
              <Input
                id="username"
                value={newUsername ? newUsername : user.username}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              {allUsernames.includes(newUsername) &&
                !(newUsername === user.username) && (
                  <p className="text-blue-600 text-xs w-fit ml-1 mt-1">
                    שם המשתמש תפוס{" "}
                  </p>
                )}
            </div>
            <div>
              <Label htmlFor="email">כתובת מייל</Label>
              <Input
                id="email"
                value={newEmail ? newEmail : user.email}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              {allEmails.includes(newEmail) && !(newEmail === user.email) && (
                <p className="text-blue-600 text-xs w-fit ml-1 mt-1">
                  כתובת המייל תפוסה{" "}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={
                (!newUsername && !image) ||
                (allUsernames.includes(newUsername) &&
                  !(newUsername === user.username))
              }
            >
              שמירת שינויים{" "}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="w-1/2 h-full">
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPosts.map((post) => (
              <div className="relative" key={post._id}>
                <Posts
                  setOpenComment={setOpenComment}
                  post={post}
                  fetchAndUpdatePost={fetchAndUpdatePost}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="p-2 absolute top-0 right-0 shadow-none"
                    >
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setOpenEdit(post._id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          <Paging
            totalPages={Math.ceil(userPosts.length / postsPerPage)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      {openEdit && (
        <EditPostModal
          postId={openEdit}
          setOpen={setOpenEdit}
          fetchPosts={fetchPosts}
        />
      )}
      {openComment && (
        <CommentSection
          postId={openComment}
          setOpen={setOpenComment}
          fetchAndUpdatePost={fetchAndUpdatePost}
        />
      )} */}
    </div>
  );
}
