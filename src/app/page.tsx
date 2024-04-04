
export default function Home() {
  return (
    <main>
      <section style={{display: 'flex', flexDirection: 'column', padding: '3rem', gap: '.5rem'}}>
        <span className="text-4xl">
          This instance is online.
        </span>
        <span className="text-medium">
          The API is reachable. Any issues encountered on the front-end are likely due to Vercel being down.
        </span>
      </section>
    </main>
  );
}
