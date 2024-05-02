import { PiHeartbeatLight } from "react-icons/pi";

export default function Home() {
  return (
    <main>
      <section style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', padding: '5rem', gap: '2rem', alignItems: 'center', justifyContent: 'center'}}>
        <PiHeartbeatLight size="7rem"/>
        <div style={{display: 'flex', flexDirection: 'column', gap: '.5rem', maxWidth: '30rem'}}>
          <span className="text-4xl">
            This instance is online.
          </span>
          <span className="text-medium text-slate-300">
            The API is reachable. Any issues encountered on the front-end are likely due to Vercel being down.
          </span>
        </div>
      </section>
    </main>
  );
}
