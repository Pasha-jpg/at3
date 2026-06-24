import Link from "next/link";
import "../styles/globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "AT3 Next.js App",
  description: "A modern application built with Next.js",
  openGraph: {
    title: "My Next.js App",
    description: "A modern web application built with Next.js",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "App Logo",
      },
    ],
    siteName: "My Next.js App",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {/* Modern Navbar */}
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" href="/">
                <span className="brand-logo"></span>
                <span className="brand-title">Khurram Next.js App</span>
              </Link>
            </div>

            <div className="navbar-menu">
              <div className="navbar-end">
                <Link className="navbar-item" href="/">
                  Home
                </Link>
                <Link className="navbar-item" href="/about2">
                  About
                </Link>
                <Link className="navbar-item" href="/users">
                  Users
                </Link>                
                <Link className="navbar-item" href="/projects">
                  Projects
                </Link>
                <Link className="navbar-item" href="/tasks">
                  Tasks
                </Link>
                <Link className="navbar-item" href="/milestones">
                  Milestones
                </Link>
                <Link className="navbar-item" href="/comments">
                  Comments
                </Link>
               
                <Link className="navbar-item" href="/checklist">
                  Checklist
                </Link>
                 <Link className="navbar-item" href="/nasa-api">
                  Nasa
                </Link>               
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="main-content">
          <div className="container">
            {children}
          </div>
        </main>

        {/* Modern Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <p>© 2025 <strong>AT3 Next.js App</strong>. Built with Next.js</p>
              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/users">Users</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/tasks">Tasks</Link>
                <Link href="/milestones">Milestones</Link>
                <Link href="/comments">Comments</Link>
                <Link href="/nasa-api">NASA API</Link>
                
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}