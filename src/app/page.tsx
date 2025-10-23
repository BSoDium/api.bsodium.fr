"use client";

import { Divider } from "@heroui/divider";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";

export default function Home() {
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
          className="container-responsive"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1.5rem",
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
          <div className="divider-wrapper">
            <Divider orientation="vertical" style={{ height: "3.5rem" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".25rem",
              maxWidth: "30rem",
            }}
          >
            <h1 className="text-2xl text-responsive">
              This instance is{" "}
              <span className="text-green-500 dark:text-green-400">online</span>
              .
            </h1>
            <h2 className="text-small font-light text-gray-500 dark:text-gray-400 text-responsive">
              The API is reachable, all services are running as expected.
            </h2>
          </div>
        </div>
      </section>
      <style jsx>{`
        @media (max-width: 768px) {
          .container-responsive {
            flex-direction: column !important;
          }
          .divider-wrapper {
            display: none;
          }
          .text-responsive {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
