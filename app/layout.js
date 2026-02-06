import Link from "next/link";

import "../styles/globals.css";

export const metadata = {
    title: "AT3 Next.js App",
    description: "A modern application built with Next.js and Bulma",
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
        <html lang="en">
            <body>
                {/* Navbar */}
                <nav
                    className="navbar is-primary"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <Link className="navbar-item" href="/">
                            <span className="title has-text-white">
                                AT3 Next.js App
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <Link className="navbar-item" href="/">
                                Home
                            </Link>
                            <Link className="navbar-item" href="/nasa-api">
                                NASA API
                            </Link>
                            <Link className="navbar-item" href="/about">
                                About
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main content section */}
                <section className="section">
                    <div className="container">
                        {children} {/* This will render the children (pages) */}
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="content has-text-centered">
                        <p>
                            © 2025 <strong>AT3 Next.js App</strong>. Built with
                            Next.js
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
