"use client";

import { PiHeartbeatLight } from "react-icons/pi";
import { useMediaQuery } from "usehooks-ts";

export default function Home() {
  const vertical = useMediaQuery("(max-width: 768px)");
  return (
    <main>
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
          <PiHeartbeatLight
            size="7rem"
            style={{ animation: "heartbeat 2s infinite", flexShrink: 0 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
              maxWidth: "30rem",
            }}
          >
            <span
              className="text-4xl"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              This instance is online.
            </span>
            <span
              className="text-medium text-slate-300"
              style={{ textAlign: vertical ? "center" : "left" }}
            >
              The API is reachable. Any issues encountered on the front-end are
              likely due to Vercel being down.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
