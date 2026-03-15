"use client";
import EmojiPicker, { EmojiClickData, Theme, SkinTonePickerLocation } from "emoji-picker-react";
// SkinTonePickerLocation — moves the yellow skin tone box away from top right

//create interface
interface EmojiModalProps{
    onClose: () => void;
    onEmojiClick: (emoji: string) => void;      //send emoji as string back to page.tsx
}

//handler functions and export it 
export default function EmojiModal({ onClose, onEmojiClick }: EmojiModalProps) {
    const handleClick = (emojiData: EmojiClickData) => {
        onEmojiClick(emojiData.emoji);    // emojiData.emoji gives us the actual emoji character
        onClose();                        // close picker after selecting
    };

    return (
        <>
            {/* Invisible overlay — click outside to close */}
            {/* self closing div so it doesnt wrap the picker */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Picker box — stopPropagation stops clicks bubbling up to overlay */}
            <div
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* X button row — sits on top of emoji picker */}
                <div className="flex justify-end bg-[#1f2937] rounded-t-xl px-3 pt-2 pb-1">
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-400 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Emoji Picker */}
                <EmojiPicker
                    onEmojiClick={handleClick}
                    theme={Theme.DARK}
                    searchPlaceholder="Search emoji..."
                    skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                />
            </div>
        </>
    );
}