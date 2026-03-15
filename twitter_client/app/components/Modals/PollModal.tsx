"use client";
import { useState } from "react";

// define the structure of a poll object
interface PollData{
    question: string;
    options: string[];
    duration: string;
}

//define props 
interface PollModalProps {
  onClose: () => void;             // closes the modal
  onSubmit: (poll: PollData) => void;  // sends poll data back to page.tsx
}

//export /define the component 
export default function PollModal({ onClose, onSubmit }: PollModalProps) {
    //use useState
    const [question, setQuestion] = useState("");                   //stores the question that user types
    const [options, setOptions] = useState<string[]>([]);          //store the options that user types
    const [duration, setDuration] = useState("1 Day");            //stores the duration (default 1 day)

    //handler functions
    //add new option
    const addOptions = () => {
        if (options.length < 4) {
            setOptions([...options, ""]); //spread or copy existing options and add new
        }
    };

    //update option if user edits
    const updateOption = (index: number, value: string) => {
        const updated = [...options];       // copy current options array
        updated[index] = value;             // update only the one user typed in
        setOptions(updated);                // save back to state
    };

    //remove option
    const removeOption = (index: number) => {
        if (options.length <= 2) return;        // cant go below 2 options
        setOptions(options.filter((_, i) => i! == index));
        // filter = keeps everything EXCEPT the one at this index
        // _ means dont care about the value, only the index i
    };

    //submit the poll (send data to page.tsx of app folder)
    const handleSubmit = () => {
        if (!question.trim()) return;           // stop if question is empty
        if (!options.some((o) => o.trim())) return;     // stop if any option is empty

        onSubmit({ question, options, duration }); // send data to page.tsx
        onClose();                                  // close modal
    };

    //Frontend
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"  onClick={onClose}>
            {/* Modal Box */}
            <div className="bg-black border border-slate-700 rounded-2xl w-[500px] p-5" onClick={(e) =>e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-bold text-lg">
                            Create Poll
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-400 text-xl"> ✕ </button>
                </div>

                {/*Input Question*/}
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question"
                    className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 outline-none border border-slate-600 mb-4"
                />
               
                {/* Options */}
                <div className="flex flex-col gap-2 mb-3">
                    {options.map((option,index)=>(
                        <div key={index} className=" flex gap-2 items-center">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Choice ${index + 1}`}
                                className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2 outline-none border border-slate-600"
                            />

                            {/* Show remove button only if more than 2 options exist */}
                            {options.length > 2 && (
                            <button onClick={() => removeOption(index)} className="text-gray-400 hover:text-red-400 text-lg"> ✕ </button>
                            )}
                        </div>
                    ))}
                </div>
            
                {/* Show add button only if less than 4 options */}
                  {options.length < 4 && (
                  <button onClick={addOptions} className="text-blue-400 hover:underline text-sm mb-4"> + Add </button>
                )}
                
                {/* Poll Duration */}
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-white text-sm">Poll length:</span>
                    <select
                        value={duration}                              
                        onChange={(e) => setDuration(e.target.value)} 
                        className="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-1 outline-none">
                        <option>1 Day</option>   {/* each option is a choice in dropdown */}
                        <option>2 Days</option>
                        <option>3 Days</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-white hover:bg-gray-300 text-black font-semibold rounded-full py-2 cursor-pointer transition-all">
                    Add Poll
                </button>
            </div>
        </div>
    );
}