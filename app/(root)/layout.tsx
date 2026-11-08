export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
