"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong</title>
        <main className="container-page py-24">
          <h1 className="title">The site couldn&apos;t load</h1>
          <p className="mt-4 text-soft">Wait a moment, then try again.</p>
          <button className="mt-8 underline underline-offset-4" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
