"use client";

import { createContext, useContext, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};
const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false,
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();

  // Memoize the Supabase client to prevent recreation on every render
  const supabase = useMemo(() => {
    if (!session) return null;

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          // Get the Supabase token with a custom fetch method
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken();

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            if (clerkToken) {
              headers.set("Authorization", `Bearer ${clerkToken}`);
            }

            // Call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );

    return client;
  }, [session]);

  return (
    <Context.Provider value={{ supabase, isLoaded: !!supabase }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase needs to be inside the provider");
  }

  return context;
};
