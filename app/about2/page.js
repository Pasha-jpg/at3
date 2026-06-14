"use client";
import ControlledCarousel from '../components/Carousel';
import styles from "./styles.module.css";
import { Suspense } from "react";
export default function About() {
  return (
    <main className={styles.header}>
      <div className="container has-text-centered">
        <h1 className={styles.myh1}>Powering UI with Next JS</h1>
        <p className="subtitle">
        API connection loaded
        </p>

      </div>

      <ControlledCarousel />
    </main>
  );
} 
