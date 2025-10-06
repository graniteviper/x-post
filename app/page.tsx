// "use client";
// import Navbar from "@/components/Navbar";
// import MainBox from "@/components/MainBox";
// import { motion } from "motion/react";
// import React, { useState, useEffect } from "react";
// import { AuroraBackground } from "@/components/ui/aurora-background";
// import { LoaderOne } from "@/components/ui/loader";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import toast, { Toaster } from "react-hot-toast";

// export default function Home() {
//   const { data: session } = useSession();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [anonymousPostsUsed, setAnonymousPostsUsed] = useState(0);

//   useEffect(() => {
//     // This runs only on the client
//     const used = Number(localStorage.getItem("anonymousPostsUsed") || 0);
//     setAnonymousPostsUsed(used);
//   }, []);

//   const handleGenerate = async (input: string, tone: string) => {
//     // Check credits
//     if (!session) {
//       if (anonymousPostsUsed >= 1) {
//         toast.error("No free credits left! Please sign in to continue.", {
//           duration: 4000,
//           position: "top-center",
//         });
//         return;
//       }
//       localStorage.setItem(
//         "anonymousPostsUsed",
//         String(anonymousPostsUsed + 1)
//       );
//       setAnonymousPostsUsed((prev) => prev + 1);
//     } else if (!session.user.isSubscribed) {
//       if ((session.user.promptCount ?? 0) >= 2) {
//         toast.error("Free limit reached! Upgrade for unlimited posts.", {
//           duration: 4000,
//           position: "top-center",
//         });
//         return;
//       }
//       // TODO: increment promptCount in backend for signed-in user
//     }

//     setIsGenerating(true);
//     setResult(null);
//     try {
//       const response: any = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL!}/generate`,
//         {
//           idea: input,
//           tone: tone,
//           email: session?.user.email ?? "anonymous",
//         }
//       );
//       setResult(response.data.post);
//       toast.success("Post generated successfully!", {
//         duration: 3000,
//         position: "top-center",
//       });
//     } catch (err) {
//       setResult("Error generating post. Please try again.");
//       toast.error("Failed to generate post. Please try again.", {
//         duration: 4000,
//         position: "top-center",
//       });
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Disable generate if no credits
//   const disableGenerate = !session && anonymousPostsUsed >= 1;

//   return (
//     <AuroraBackground className="min-h-screen flex flex-col overflow-hidden">
//       <Toaster
//         toastOptions={{
//           className: "",
//           style: {
//             background: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(10px)",
//             color: "#363636",
//             border: "1px solid rgba(255, 255, 255, 0.3)",
//             padding: "16px",
//             borderRadius: "12px",
//             boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
//           },
//         }}
//       />

//       {/* 🧭 Fixed Navbar */}
//       <div className="w-full fixed top-4 left-0 z-50 bg-transparent">
//         <Navbar anonymousPostsUsed={anonymousPostsUsed} />
//       </div>

//       {/* 🧩 Main content */}
//       <div className="flex flex-col items-center justify-center flex-1 pt-32 pb-20 space-y-10">
//         {/* Animated MainBox */}
//         <motion.div
//           animate={{
//             y: result || isGenerating ? -60 : 0,
//             scale: result || isGenerating ? 0.9 : 1,
//           }}
//           transition={{ duration: 0.7, ease: "easeInOut" }}
//         >
//           <MainBox
//             onGenerate={handleGenerate}
//             disableGenerate={disableGenerate}
//           />
//         </motion.div>

//         {/* Generated Output Box */}
//         {(isGenerating || result) && (
//           <motion.div
//             initial={{ opacity: 0, y: 60, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 flex flex-col items-center gap-6 shadow-xl w-full max-w-4xl"
//           >
//             {isGenerating ? (
//               <>
//                 <LoaderOne />
//                 <p className="text-zinc-600 text-lg mt-2">
//                   Generating your post...
//                 </p>
//               </>
//             ) : (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-zinc-600 text-xl leading-relaxed text-center"
//               >
//                 {result}
//               </motion.p>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </AuroraBackground>
//   );
// }

"use client";
import Navbar from "@/components/Navbar";
import MainBox from "@/components/MainBox";
import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LoaderOne } from "@/components/ui/loader";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

type IncrementPromptResponse = {
  success: boolean;
  promptCount: number;
};

export default function Home() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [anonymousPostsUsed, setAnonymousPostsUsed] = useState(0);

  useEffect(() => {
    const used = Number(localStorage.getItem("anonymousPostsUsed") || 0);
    setAnonymousPostsUsed(used);
  }, []);

  const resetDailyLimit = (lastReset: string | Date) => {
    const today = new Date();
    const resetDate = new Date(lastReset);
    return (
      today.getFullYear() !== resetDate.getFullYear() ||
      today.getMonth() !== resetDate.getMonth() ||
      today.getDate() !== resetDate.getDate()
    );
  };

  // const handleGenerate = async (input: string, tone: string) => {
  //   if (!input.trim()) return;
  //   if (!tone) return;

  //   if (!session) {
  //     if (anonymousPostsUsed >= 1) {
  //       toast.error("No free posts left today! Sign in for more.");
  //       return;
  //     }
  //     localStorage.setItem("anonymousPostsUsed", String(anonymousPostsUsed + 1));
  //     setAnonymousPostsUsed((prev) => prev + 1);
  //   } else {
  //     // if (resetDailyLimit(session.user.lastReset)) {
  //     //   await axios.post("/api/reset-daily", { userId: session.user.id });
  //     //   session.user.promptCount = 0;
  //     // }

  //     if ((session.user.promptCount ?? 0) >= 3) {
  //       toast.error("You reached your daily limit of 3 posts today!");
  //       return;
  //     }

  //     await axios.post("/api/increment-prompt", { userId: session.user.id });
  //   }

  //   setIsGenerating(true);
  //   setResult(null);

  //   try {
  //     const response: any = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL!}/generate`,
  //       {
  //         idea: input,
  //         tone: tone,
  //         email: session?.user.email ?? "anonymous",
  //       }
  //     );
  //     setResult(response.data.post);
  //     toast.success("Post generated successfully!");
  //   } catch (err) {
  //     setResult("Error generating post. Please try again.");
  //     toast.error("Failed to generate post.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  //   const handleGenerate = async (input: string, tone: string) => {
  //   if (!input.trim() || !tone) return;

  //   if (!session) {
  //     // Anonymous
  //     if (anonymousPostsUsed >= 1) {
  //       toast.error("No free posts left today! Sign in for more.");
  //       return;
  //     }
  //     localStorage.setItem("anonymousPostsUsed", String(anonymousPostsUsed + 1));
  //     setAnonymousPostsUsed((prev) => prev + 1);
  //   } else {
  //     // Signed-in user
  //     const { data: incrementedUser } = await axios.post("/api/increment-prompt", {
  //       userId: session.user.id,
  //     });

  //     // incrementedUser.promptCount is the **latest count from DB**
  //     if (incrementedUser.promptCount > 3) {
  //       toast.error("You reached your daily limit of 3 posts today!");
  //       return;
  //     }

  //     // Do NOT manually increment session.user.promptCount
  //   }

  //   setIsGenerating(true);
  //   setResult(null);

  //   try {
  //     const response: any = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL!}/generate`,
  //       {
  //         idea: input,
  //         tone: tone,
  //         email: session?.user.email ?? "anonymous",
  //       }
  //     );
  //     setResult(response.data.post);
  //     toast.success("Post generated successfully!");
  //   } catch (err) {
  //     setResult("Error generating post. Please try again.");
  //     toast.error("Failed to generate post.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleGenerate = async (input: string, tone: string) => {
    if (!input.trim() || !tone) return;

    if (!session) {
      // Anonymous
      if (anonymousPostsUsed >= 1) {
        toast.error("No free posts left today! Sign in for more.");
        return;
      }
      localStorage.setItem(
        "anonymousPostsUsed",
        String(anonymousPostsUsed + 1)
      );
      setAnonymousPostsUsed((prev) => prev + 1);
    } else {
      // Signed-in user
      const response = await axios.post<IncrementPromptResponse>(
        "/api/increment-prompt",
        {
          userId: session.user.id,
        }
      );

      const incrementedUser = response.data;

      if (incrementedUser.promptCount > 3) {
        toast.error("You reached your daily limit of 3 posts today!");
        return;
      }

      // Do NOT manually increment session.user.promptCount
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response: any = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/generate`,
        {
          idea: input,
          tone: tone,
          email: session?.user.email ?? "anonymous",
        }
      );
      setResult(response.data.post);
      toast.success("Post generated successfully!");
    } catch (err) {
      setResult("Error generating post. Please try again.");
      toast.error("Failed to generate post.");
    } finally {
      setIsGenerating(false);
    }
  };

  const disableGenerate = !session && anonymousPostsUsed >= 1;

  return (
    <AuroraBackground className="min-h-screen flex flex-col overflow-hidden">
      <Toaster
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            color: "#363636",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <div className="w-full fixed top-4 left-0 z-50 bg-transparent">
        <Navbar anonymousPostsUsed={anonymousPostsUsed} />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 pt-32 pb-20 space-y-10">
        <motion.div
          animate={{
            y: result || isGenerating ? -60 : 0,
            scale: result || isGenerating ? 0.9 : 1,
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <MainBox
            onGenerate={handleGenerate}
            disableGenerate={disableGenerate}
          />
        </motion.div>

        {(isGenerating || result) && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 flex flex-col items-center gap-6 shadow-xl w-full max-w-4xl"
          >
            {isGenerating ? (
              <>
                <LoaderOne />
                <p className="text-zinc-600 text-lg mt-2">
                  Generating your post...
                </p>
              </>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-600 text-xl leading-relaxed text-center"
              >
                {result}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </AuroraBackground>
  );
}
