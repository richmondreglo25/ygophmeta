"use client";

export function Facebook() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900">
      <div className="flex flex-col">
        <span className="font-semibold text-base mb-1">
          Follow us on Facebook!
        </span>
        <a
          href="https://www.facebook.com/profile.php?id=61585498412179"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline text-sm hover:text-blue-900 font-medium"
        >
          facebook.com/ygophmeta
        </a>
      </div>
    </div>
  );
}
