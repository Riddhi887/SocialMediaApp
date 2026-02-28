"use client";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { CredentialResponse, GoogleLogin} from "@react-oauth/google";
import { GoHome } from "react-icons/go";
import { RiSearchLine, RiNotification4Line } from "react-icons/ri";
import { BiEnvelope } from "react-icons/bi";
import { SlUserFollow } from "react-icons/sl";
import { CgMoreO } from "react-icons/cg";
import React, { useCallback } from "react";
import { Grok } from "@lobehub/icons";
import FeedCard from "@/components/FeedCard/page";
import { toast } from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifygoogleTokenUserQuery } from "@/graphql/query/user";



interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

// Sidebar menu items
const sideBarMenuItems: TwitterSidebarButton[] = [
  { title: "Home", icon: <GoHome /> },
  { title: "Explore", icon: <RiSearchLine /> },
  { title: "Notifications", icon: <RiNotification4Line /> },
  { title: "Follow", icon: <SlUserFollow /> },
  { title: "Chat", icon: <BiEnvelope /> },
  { title: "Grok", icon: <Grok/> },
  { title: "Profile", icon: <SlUserFollow /> }, // placeholder icon
  { title: "More", icon: <CgMoreO /> },    // placeholder icon
];

export default function Home() {

  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
    //get token
    const googleToken = cred.credential;

    //throw error using toast library if token dont exist
    if (!googleToken)return toast.error("Failed to login with Google");

    
    //else verify google token
    const { verifyGoogleToken } = await graphqlClient.request(verifygoogleTokenUserQuery, { token: googleToken });
    toast.success("Verification Successful");

    console.log(verifyGoogleToken);
    
  },
    []);
  return (
    <div >
      <div className="grid grid-cols-12 h-screen w-screen px-35 py-0.5">
        {/* Sidebar column */}
        <div className="col-span-2 flex flex-col justify-start py-0.5 ">
          {/* Twitter logo */}
          <div className="text-3xl h-fit w-fit hover:bg-gray-900 rounded-full p-2.5 cursor-pointer transition-all">
            <FaXTwitter />
          </div>

          {/* Sidebar menu items */}
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

        {/* Post Button */}
        <button
          className="mt-4 bg-white hover:bg-gray-200 rounded-3xl px-10 py-3 font-semibold text-black flex items-center justify-center">
          Post
        </button>
        </div>

        {/* Middle content */}
        <div className="col-span-7 border-l border-r border-slate-700 ml-15 mr-12">
          <FeedCard />
          <FeedCard />
          <FeedCard/>
          
        </div>

        {/* Right column */}
        <div className="col-span-3 p-5 ">
          <div className="p-4 bg-slate-900 rounded-lg">
            <h1 className="my-1.5 text-xl">New to Twitter?</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
          
        </div>
      </div>
    </div>
  );
}