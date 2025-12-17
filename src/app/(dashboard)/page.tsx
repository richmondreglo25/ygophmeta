import Image from "next/image";
import styles from "./page.module.css";
import ChartComponent from "../components/ChartComponent";
import { getImagePath } from "../utils/enviroment-utils";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="text-2xl font-bold mb-4">
          React + Tailwind + Chart.js + WebP Demo
        </h1>
        <div className="mb-8">
          <ChartComponent />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Sample WebP Image</h2>
          <Image
            src={getImagePath("sample.webp")}
            alt="Sample WebP"
            width={300}
            height={200}
            priority
            style={{ borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src={getImagePath("../vercel.svg")}
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
