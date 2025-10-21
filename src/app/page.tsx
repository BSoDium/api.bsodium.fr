"use client";

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
            gap: "2rem",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UseAnimations
            animation={activity}
            size={56}
            strokeColor="currentColor"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".25rem",
              maxWidth: "30rem",
            }}
          >
            <h1
              className="text-2xl"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              This instance is{" "}
              <span className="text-green-500 dark:text-green-400">online</span>
              .
            </h1>
            <h2
              className="text-small text-gray-500 dark:text-gray-400"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              The API is reachable, all services are running as expected.
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}
