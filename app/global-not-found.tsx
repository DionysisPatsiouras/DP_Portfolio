import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en/" />
      </head>
      <body>
        <p>
          <Link href="/en/">Continue to About</Link>
        </p>
      </body>
    </html>
  );
}
