"use client"; //tells browser it is client side file 
import { useState } from "react";  //helps to store and update data inside component

interface GifModalProps {
    onClose: () => void;
    onSelect: (gifUrl: string) => void; //function called when gif picked by user
}

//destructure props directly so we can use onClose and onSelect directly without writing props.onClose
export default function GifModal({ onClose, onSelect }: GifModalProps) {
    
    //use useState to get value and setter function
    const [query, setQuery] = useState("");         // stores what user types in search box
    const [gifs, setGifs] = useState<any[]>([]);    // stores Gif Array from the existing gif array
    const [loading, setLoading] = useState(false);  // tracks if API call is in progress

    // Search function 
    const searchGif = async () => {
        if (!query.trim()) return;      //if nothing in search box return nothing

        setLoading(true);

        const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;    // free key at developers.giphy.com
        
        // calls GIPHY API with our search term
        const res = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=12`
        );
        
        const data = await res.json();      // converts response to JS object
        setGifs(data.data);                 // saves the GIF array into state
        setLoading(false);                  // hide loading state
    };

    return (
        // fixed = stays in place even when page scrolls
        // inset-0 = covers entire screen
        // z-50 = sits on top of everything
        // flex = enables centering — without this items-center and justify-center dont work
        // bg-black/60 = semi transparent dark background
        // onClick = click outside modal to close
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            {/* Modal Box — stopPropagation prevents closing when clicking inside modal */}
            <div
                className="bg-black border border-slate-700 rounded-2xl w-[500px] p-4"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white font-bold text-lg">Pick a GIF</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-400 text-xl">✕</button>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={query}                                               
                        onChange={(e) => setQuery(e.target.value)}                  
                        onKeyDown={(e) => { if (e.key === "Enter") searchGif(); }} 
                        placeholder="Search GIFs..."
                        className="flex-1 bg-slate-800 text-white rounded-full px-4 py-2 outline-none border border-slate-600"
                    />
                    <button
                        onClick={searchGif}   
                        className="bg-white hover:bg-gray-300 text-black rounded-full px-4 py-2 font-semibold"
                    >
                        Search
                    </button>
                </div>

                {/* GIF Grid */}
                {/* grid-cols-3 = 3 GIFs per row */}
                {/* max-h-72 = fixed height so it doesnt grow forever */}
                {/* overflow-y-auto = scroll if too many GIFs */}
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
                    {gifs.map((gif) => (        // loop through each GIF in state
                        <img
                            key={gif.id}                            // unique key React needs for lists
                            src={gif.images.fixed_height.url}       // GIF url from GIPHY response
                            alt={gif.title}
                            className="rounded-lg cursor-pointer hover:opacity-80 transition-all w-full h-28 object-cover"
                            onClick={() => {
                                onSelect(gif.images.fixed_height.url);  // sends GIF url back to page.tsx
                                onClose();                               // closes modal after selection
                            }}
                        />
                    ))}
                </div>

                {/* Loading state */}
                {loading && (
                    <p className="text-gray-500 text-center py-8">Searching...</p>
                )}

                {/* Empty state */}
                {!loading && gifs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Search for GIFs above</p>
                )}

            </div>
        </div>
    );
}