"use client";

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import {
  
  PiGithubLogoLight,
  PiDiscordLogoLight,
} from "react-icons/pi";

import {
  AnimatePresence,
  motion,
  useCycle,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

const itemVariants = {
  closed: {
    opacity: 0,
  },
  open: { opacity: 1 },
};

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
};

const ButtonVariant = {
  closed: {
    height: "4rem",
    transition: { duration: 0.1 },
  },

  open: {
    height: "25rem",
    transition: { when: "beforeChildren", duration: 0.1 },
  },
};

let textvariant = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};



let Icons = [
  { name: <PiDiscordLogoLight />, href: "https://discord.gg/Xcj23Wsb" },
  { name: <PiGithubLogoLight />, href: "https://github.com/generativevisions" },
];



function Headpage() {
 
  const [checked, setChecked] = useState(false);

 

  

  return (
    <>
      <div className="flex justify-between md:max-w-5xl max-w-lg mx-auto lg:mt-16 mt-11 md:px-8 px-9">
        <div className="flex gap-x-3 items-center">
          <Switch checked={checked} setChecked={setChecked} />
        
        </div>

        <div className="flex   gap-x-6 ">
          {Icons.map((each) => (
            <div
              key={each.name}
              className="hover:text-neutral-600 cursor-pointer scale-125 transition-all ease-in text-xl duration-200  dark:text-white"
            >
              <Link href={each.href}>{each.name}</Link>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Headpage;

const Switch = ({ checked, setChecked }) => {
  let { resolvedTheme, setTheme } = useTheme();
  let otherTheme = resolvedTheme === "dark" ? "light" : "dark";

  let toggleTheme = (e) => {
    setChecked(e.target.checked);
    setTheme(otherTheme);
  };
  return (
    <form className="flex space-x-4  antialiased items-center">
      <label
        htmlFor="checkbox"
        className={twMerge(
          "h-7  px-1  flex items-center border border-transparent shadow-[inset_0px_0px_12px_rgba(0,0,0,0.25)] rounded-full w-[60px] relative cursor-pointer transition duration-200",
          checked ? "bg-cyan-500" : "bg-[#07070A] border-slate-800"
        )}
      >
        <motion.div
          initial={{
            width: "20px",
            x: checked ? 0 : 32,
          }}
          animate={{
            height: ["20px", "10px", "20px"],
            width: ["20px", "30px", "20px", "20px"],
            x: checked ? 32 : 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          // key={String(checked)}
          className={twMerge(
            "h-[20px] block rounded-full bg-white shadow-md z-10"
          )}
        ></motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={toggleTheme}
          className="hidden"
          id="checkbox"
        />
      </label>
    </form>
  );
};

export function ThemeToggleNav({ className, rel, mouseX, ...props }) {
  let { resolvedTheme, setTheme } = useTheme();
  let otherTheme = resolvedTheme === "dark" ? "light" : "dark";
  let [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <></>;
}
