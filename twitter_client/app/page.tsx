"use client";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { GoBell, GoHome, GoSearch } from "react-icons/go";
import { BiEnvelope } from "react-icons/bi";
import { SlUserFollow } from "react-icons/sl";
import { CgMoreO } from "react-icons/cg";
import React from "react";
import { Grok } from "@lobehub/icons";
import FeedCard from "@/components/FeedCard/page";
import { toast } from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifygoogleTokenUserQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sideBarMenuItems: TwitterSidebarButton[] = [
  { title: "Home", icon: <GoHome /> },
  { title: "Explore", icon: <GoSearch /> },
  { title: "Notifications", icon: <GoBell /> },
  { title: "Follow", icon: <SlUserFollow /> },
  { title: "Chat", icon: <BiEnvelope /> },
  { title: "Grok", icon: <Grok /> },
  { title: "Profile", icon: <SlUserFollow /> },
  { title: "More", icon: <CgMoreO /> },
];

export default function Home() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  console.log(user);

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const googleToken = tokenResponse.access_token;
      if (!googleToken) return toast.error("Failed to login with Google");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifygoogleTokenUserQuery,
        { token: googleToken }
      );

      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
        toast.success("Verification Successful");
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
    },
    onError: () => toast.error("Google login failed"),
    scope: "openid email profile",
  });

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-35 py-0.5">
        <div className="col-span-2 flex flex-col justify-start py-0.5">
          <div className="text-3xl h-fit w-fit hover:bg-gray-900 rounded-full p-2.5 cursor-pointer transition-all">
            <FaXTwitter />
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {sideBarMenuItems.map((item) => (
              <li
                className="flex justify-start items-center gap-4 cursor-pointer hover:bg-gray-900 rounded-2xl px-3 py-1.5 max-w-fit transition-all"
                key={item.title}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="font-medium text-xl">{item.title}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 bg-white hover:bg-gray-200 rounded-3xl px-10 py-3 font-semibold text-black flex items-center justify-center">
            Post
          </button>

          {user && (
            <div className="mt-auto mb-4 flex items-center gap-3 hover:bg-gray-900 rounded-2xl px-3 py-2 cursor-pointer transition-all w-full">
              {user.profileImageURL && (
                <Image
                  src={user.profileImageURL}
                  alt="user-profile-image"
                  height={40}
                  width={40}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-white font-semibold text-sm truncate">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7 border-l border-r border-slate-700 ml-15 mr-12">
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>

        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-4 bg-slate-900 rounded-lg">
              <h1 className="my-1.5 text-xl">New to Twitter?</h1>
              <button
                onClick={() => handleLoginWithGoogle()}
                className="w-full mt-2 bg-white text-black rounded-full px-4 py-2 font-semibold hover:bg-gray-200 transition-all"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}