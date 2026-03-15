"use client";
import Image from "next/image";
import { MdOutlineGifBox } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { BiPoll } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { useState, useCallback } from "react";
import GifModal from "@/app/components/Modals/GifModal";
import PollModal from "@/app/components/Modals/PollModal";
import EmojiModal from "@/app/components/Modals/EmojiModal";
import { useCurrentUser } from "@/hooks/user";

interface CreateTweetModalProps {
  onClose?: () => void;  // optional — not needed when used inline in feed
  inline?: boolean;      // true = render directly in feed, false = full modal with overlay
}

export default function CreateTweetModal({ onClose, inline = false }: CreateTweetModalProps) {
  const { user } = useCurrentUser(); // get current logged in user

  const [tweetText, setTweetText] = useState(""); // stores what user types and emojis appended afterwards as well vice versa
  const [showGifModal, setShowGifModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  // to able to get images from device storage
  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input"); // creates an input tag
    input.setAttribute("type", "file"); // input of type file
    input.setAttribute("accept", "image/*"); // accept only image
    input.click();
  }, []);

  // gif handler
  const handleGifSelect = useCallback((gifUrl: string) => {
    console.log("GIF selected:", gifUrl);
    // later to attach this gifUrl to the tweet before posting
  }, []);

  // poll handler
  const handlePollSubmit = useCallback((poll: { question: string; options: string[]; duration: string }) => {
    console.log("Poll created:", poll);
    // later to attach this poll to the tweet before posting
  }, []);

  // emoji handler — appends emoji to existing tweet text
  const handleEmojiSelect = useCallback((emoji: string) => {
    setTweetText((prev) => prev + emoji); // prev = existing text, adds emoji at the end
    setShowEmojiModal(false);
  }, []);

  // the shared tweet composer card used in both inline and modal modes
  const composerCard = (
    <div className="flex gap-4">

      {/* User profile image */}
      <div className="shrink-0">
        {user?.profileImageURL && (
          <Image
            src={user.profileImageURL}
            alt="user-image"
            height={40}
            width={40}
            className="rounded-full"
          />
        )}
      </div>

      <div className="flex-1">
        {/* Tweet text area */}
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          className="w-full bg-transparent outline-none text-white text-xl resize-none placeholder-gray-500 border-b border-gray-500"
          rows={inline ? 3 : 4} // slightly taller in modal
          placeholder="What's happening?"
        />

        <div className="flex justify-between items-center mt-2">
          {/* Left side: icons */}
          <div className="flex space-x-5">
            <CiImageOn
              onClick={handleSelectImage}
              className="text-xl text-blue-400 cursor-pointer rounded-full hover:bg-blue-400/20 transition-all"
            />
            <MdOutlineGifBox
              onClick={() => setShowGifModal(true)}
              className="text-xl text-blue-400 cursor-pointer rounded-full hover:bg-blue-400/20 transition-all"
            />
            <BiPoll
              onClick={() => setShowPollModal(true)}
              className="text-xl text-blue-400 cursor-pointer rounded-full hover:bg-blue-400/20 transition-all"
            />
            <BsEmojiSmile
              onClick={() => setShowEmojiModal(true)}
              className="text-xl text-blue-400 cursor-pointer rounded-full hover:bg-blue-400/20 transition-all"
            />
          </div>

          {/* Right side: Post button */}
          <button className="bg-white hover:bg-gray-400 text-black font-semibold rounded-full px-5 py-2 transition-all">
            Post
          </button>
        </div>
      </div>
    </div>
  );

  // inline mode — render directly in the feed like a FeedCard
  if (inline) {
    return (
      <>
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 transition-all">
          {composerCard}
        </div>

        {/* Modals — outside the card so fixed centering works correctly */}
        {showGifModal && (
          <GifModal onClose={() => setShowGifModal(false)} onSelect={handleGifSelect} />
        )}
        {showPollModal && (
          <PollModal onClose={() => setShowPollModal(false)} onSubmit={handlePollSubmit} />
        )}
        {showEmojiModal && (
          <EmojiModal onClose={() => setShowEmojiModal(false)} onEmojiClick={handleEmojiSelect} />
        )}
      </>
    );
  }

  // modal mode — dark overlay with close button, triggered by sidebar Post button
  return (
    <>
      {/* Dark overlay — click outside to close */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={onClose}
      >
        {/* Modal box — stopPropagation so clicking inside doesn't close it */}
        <div
          className="bg-black border border-slate-700 rounded-2xl w-150 p-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header row with X close button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-400 text-xl"
            >
              ✕
            </button>
          </div>

          {composerCard}
        </div>
      </div>

      {/* Modals — outside overlay so their own fixed centering works correctly */}
      {showGifModal && (
        <GifModal onClose={() => setShowGifModal(false)} onSelect={handleGifSelect} />
      )}
      {showPollModal && (
        <PollModal onClose={() => setShowPollModal(false)} onSubmit={handlePollSubmit} />
      )}
      {showEmojiModal && (
        <EmojiModal onClose={() => setShowEmojiModal(false)} onEmojiClick={handleEmojiSelect} />
      )}
    </>
  );
}