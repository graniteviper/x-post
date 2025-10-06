"use client";
import React, { useRef, useState } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Tone } from "./Tone";
import toast from "react-hot-toast";

type MainBoxProps = {
  onGenerate: (input: string, tone: string) => void;
  disableGenerate?: boolean;
};

const MainBox = ({ onGenerate, disableGenerate }: MainBoxProps) => {
  const [tone, settone] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disableGenerate) {
      toast.error("No credits left! Please sign in or upgrade to generate more posts.", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const inputValue = inputRef.current?.value.trim();

    if (!inputValue) {
      toast.error("Please enter your post idea!", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!tone) {
      toast.error("Please select a tone for your post!", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    onGenerate(inputValue, tone);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl py-14 px-24 flex flex-col items-center gap-8 shadow-xl w-full max-w-4xl">
      <h1 className="text-5xl md:text-5xl font-semibold text-black text-center">
        What will you post today?
      </h1>

      <input
        ref={inputRef}
        placeholder="Type here..."
        className="w-full px-6 py-4 text-lg rounded-full bg-gray-200 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30"
      />

      <div className="flex justify-between w-full">
        <Tone settone={settone} tone={tone} />
        <HoverBorderGradient
          containerClassName="rounded-full cursor-pointer"
          as="button"
          onClick={handleClick}
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          <span>Generate</span>
        </HoverBorderGradient>
      </div>
    </div>
  );
};

export default MainBox;