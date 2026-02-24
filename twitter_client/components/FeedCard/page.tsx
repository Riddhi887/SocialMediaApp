import React from 'react';
import Image from 'next/image';
import { FaRegComment } from 'react-icons/fa6';
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io";
import { FiBookmark } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-l-0 border-r-0 border-b-0 border-slate-700 p-4">
      <div className="grid grid-cols-12 gap-x-3">
        <div className="col-span-1 pt-0.5 pb-1.5">
          <Image
            src="https://avatars.githubusercontent.com/u/147044631?s=400&u=7ff778e172434b6517711cbee26992d8f9071ee3&v=4"
            alt="user-image"
            height={50}
            width={50}
            className="rounded-full"
          />
        </div>
        <div className="col-span-11 pt-0.5">
          <h5 className="font-bold">Riddhi Bagal</h5>
          <p className="font-medium text-sm">
            I’m confused  
            Can someone explain the real difference between React.js and Next.js in simple terms?
          </p>
          <div className="flex justify-between mt-5 mb-1 text-l  pr-3 cursor-pointer transition-all">
            {/* Left group of icons */}
            <div className="flex space-x-19 text-gray-400 gap-6">
              <FaRegComment className="hover:text-blue-500"/>
              <AiOutlineRetweet className='hover:text-green-500' /> 
              <FaRegHeart className="hover:text-red-500" />
              <IoIosStats className=" hover:text-blue-500"/>
            </div>
            {/* Right group of icons */}
            <div className="flex space-x-4 ml-auto  text-gray-400">
              <FiBookmark className=" hover:text-blue-500" />
              <FiUpload  className=" hover:text-blue-500"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;