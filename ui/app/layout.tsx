import "../styles/globals.css";

export const metadata = {
  title: 'Mina zkApp UI',
  description: 'built with o1js',
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-center items-center" style={{ height: "50px" }}>
          <a className="m-10 text-black text-lg" href="/">Home</a>
          <a className="m-10 text-black text-lg" href="/stat">Stat</a>
        </header>
        <div>{children}</div></body>
    </html>
  );
}
