import { Hammer } from "lucide-react";

export default function InProgress() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <Hammer size={48} className="text-yellow-500" />
      <h1 className="text-2xl font-bold">Page in Construction</h1>
      <p className="text-gray-500">
        We’re working hard to bring this page to life. Please check back soon!
      </p>
    </div>
  );
}
