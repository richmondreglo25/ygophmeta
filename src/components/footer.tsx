"use client";

export function Footer() {
  return (
    <footer className="w-full dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-4 border-t dark:border-gray-800">
      <div className="w-full max-w-3xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-1 text-sm">
          <span>© 2025 Yu-Gi-Oh! PH Meta. All rights reserved.</span>
          <span>
            This website is not affiliated with or endorsed by Konami or any
            official Yu-Gi-Oh! entity. All Yu-Gi-Oh! trademarks and assets
            belong to their respective owners.
          </span>
        </div>
      </div>
    </footer>
  );
}
