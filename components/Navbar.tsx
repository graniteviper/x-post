"use client";
import { Sun, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  anonymousPostsUsed?: number;
}

const Navbar = ({ anonymousPostsUsed = 0 }: NavbarProps) => {
  const { data: session } = useSession();
  const [postsLeft, setPostsLeft] = useState(1 - anonymousPostsUsed);

  useEffect(() => {
    if (session) {
      setPostsLeft(Math.max(3 - (session.user.promptCount ?? 0),0));
    } else {
      setPostsLeft(Math.max(1 - anonymousPostsUsed, 0));
    }
  }, [session, anonymousPostsUsed]);

  return (
    <div className="w-full h-full flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold">X-Post</h2>
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      </div>

      <div className="flex gap-4 items-center">
        {/* <Sun /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-white/10 cursor-pointer overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-4 flex flex-col gap-3">
            <div className="text-zinc-600 font-medium">
              Posts left today: {postsLeft}
            </div>
            <DropdownMenuSeparator />
            {session ? (
              <DropdownMenuItem
                className="cursor-pointer text-black bg-white rounded-lg text-center py-2"
                onClick={() => signOut()}
              >
                Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer text-black bg-white rounded-lg text-center py-2"
                onClick={() => signIn("google")}
              >
                Sign in / Sign up with Google
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
