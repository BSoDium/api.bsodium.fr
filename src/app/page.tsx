"use client";

import { Divider } from "@heroui/divider";
import { motion } from "motion/react";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import { useMediaQuery } from "usehooks-ts";

export default function Home() {
  const vertical = useMediaQuery("(max-width: 768px)");
  return (
    <main className="bg-white dark:bg-black">
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
          height: "100vh",
          padding: "2rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            gap: "1.5rem",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            layoutId="status-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <UseAnimations
              animation={activity}
              size={56}
              strokeColor="currentColor"
            />
          </motion.div>
          {!vertical && (
            <Divider orientation="vertical" style={{ height: "3.5rem" }} />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".25rem",
              maxWidth: "30rem",
            }}
          >
            <motion.h1
              layoutId="status-heading"
              className="text-2xl"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              This instance is{" "}
              <span className="text-green-500 dark:text-green-400">online</span>
              .
            </motion.h1>
            <motion.h2
              layoutId="status-subheading"
              className="text-small font-light text-gray-500 dark:text-gray-400"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              The API is reachable, all services are running as expected.
            </motion.h2>
          </div>
        </div>
      </section>
    </main>
  );
}
