"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Layout,
  CheckSquare,
  Loader2,
} from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { boardDataService } from "@/lib/services";
import { useRouter } from "next/navigation";
import { Board, TaskWithBoardInfo } from "@/lib/supabase/models";

interface TopBarProps {
  title?: string;
}

interface SearchResults {
  boards: Board[];
  tasks: TaskWithBoardInfo[];
}

export function TopBar({ title = "Dashboard" }: TopBarProps) {
  const router = useRouter();
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    boards: [],
    tasks: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ boards: [], tasks: [] });
      return;
    }

    const search = async () => {
      if (!user || !supabase) return;

      setLoading(true);
      try {
        const data = await boardDataService.searchGlobal(
          supabase,
          user.id,
          query,
        );
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query, user, supabase]);

  const handleSelectBoard = (boardId: string) => {
    setOpen(false);
    router.push(`/boards/${boardId}`);
  };

  const handleSelectTask = (boardId: string) => {
    setOpen(false);
    router.push(`/boards/${boardId}`); // Ideally navigate to task, but board is fine for now
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-gray-500"
      >
        <span>Workspace</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="font-semibold text-gray-900" aria-current="page">
          {title}
        </span>
      </nav>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="relative h-9 w-80 justify-start bg-gray-50 text-sm text-gray-500 shadow-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search tasks, boards...</span>
                <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100 md:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Type to search..."
                  value={query}
                  onValueChange={setQuery}
                />
                <CommandList>
                  {loading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}

                  {!loading &&
                    query.length > 0 &&
                    results.boards.length === 0 &&
                    results.tasks.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}

                  {results.boards.length > 0 && (
                    <CommandGroup heading="Boards">
                      {results.boards.map((board) => (
                        <CommandItem
                          key={board.id}
                          value={board.id}
                          onSelect={() => handleSelectBoard(board.id)}
                          className="cursor-pointer"
                        >
                          <Layout className="mr-2 h-4 w-4" />
                          <span>{board.title}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {results.tasks.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading="Tasks">
                        {results.tasks.map((task) => (
                          <CommandItem
                            key={task.id}
                            value={task.id}
                            onSelect={() => handleSelectTask(task.board_id)}
                            className="cursor-pointer"
                          >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                              <span>{task.title}</span>
                              <span className="text-xs text-gray-400">
                                in {task.board_title}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Actions */}
      </div>
    </header>
  );
}
