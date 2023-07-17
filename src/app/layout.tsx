"use client";

import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { useContext, useMemo, useState } from "react";
import { User } from "@/components/User/User";
import UserContext from "@/components/context/UserContext";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // null = Default value, or when not logged in yet
  const userProviderVal = useMemo(() => ({ user, setUser }), [user]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext.Provider value={userProviderVal}>
          <Header />
          <main>{children}</main>
        </UserContext.Provider>
      </body>
    </html>
  );
}
