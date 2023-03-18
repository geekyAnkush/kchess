"use client";

import type { User } from "@chessu/types";

import { useState, useEffect } from "react";
import { SessionContext } from "./session";
import { fetchSession } from "@/lib/auth";

const { ethereum } = typeof window !== "undefined" ? window : {};
export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({});
  const [error, setError] = useState("");
  const [account, setAccount] = useState(null);

  // useEffect(() => {});
  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };
  const connectWallet = async () => {
    setError("");
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });
        console.log(accounts);
        setAccount(accounts[0]);
        setUser(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  async function getSession() {
    const user = await fetchSession();
    setUser(user || null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, account, connectWallet, error }}>
      {children}
    </SessionContext.Provider>
  );
}
