"use client";

import Link from "next/link";
import { 
  MdPeople,
  MdBarChart,
  MdCheckCircle,
  MdTrackChanges,
  MdComment,
  MdRocket,
  MdInfo
} from "react-icons/md";

export default function HomePage() {
  const features = [
    {
      title: "Users",
      description: "View and manage user accounts with workspace assignments",
      link: "/users",
      color: "feature-users",
      icon: MdPeople
    },
    {
      title: "Projects",
      description: "Create, edit, and manage project timelines",
      link: "/projects",
      color: "feature-projects",
      icon: MdBarChart
    },
    {
      title: "Tasks",
      description: "Track and manage task status and assignments",
      link: "/tasks",
      color: "feature-tasks",
      icon: MdCheckCircle
    },
    {
      title: "Milestones",
      description: "Set and track project goals and deadlines",
      link: "/milestones",
      color: "feature-milestones",
      icon: MdTrackChanges
    },
    {
      title: "Comments",
      description: "Collaborate with team feedback and discussions",
      link: "/comments",
      color: "feature-comments",
      icon: MdComment
    },
    {
      title: "NASA API",
      description: "Explore space imagery and astronomical data",
      link: "/nasa-api",
      color: "feature-nasa",
      icon: MdRocket
    },
    {
      title: "About",
      description: "Learn more about this application and tech stack",
      link: "/about",
      color: "feature-about",
      icon: MdInfo
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">NM TAFE Project</div>
          <h1 className="hero-title">
            Modern app with
            <span className="hero-highlight"> Next.js</span>
          </h1>
          <p className="hero-description">
            A complete starter application with users, projects, tasks, 
            milestones, comments, and NASA API integration. Built with Next.js and modern CSS.
          </p>
          <div className="hero-buttons">
            <Link href="/projects" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/users" className="btn btn-secondary">
              View Users
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2 className="features-title">Explore the app</h2>
          <p className="features-subtitle">Everything you need to manage your workflow</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link href={feature.link} key={feature.title} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-description">{feature.description}</p>
                <span className="feature-link">Explore →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">Pages</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Database Tables</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">API</div>
            <div className="stat-label">Integration</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Responsive</div>
          </div>
        </div>
      </section>
    </>
  );
}