import { Trello } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse">
            <Trello className="h-7 w-7 text-white" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-blue-600 animate-ping opacity-20" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
