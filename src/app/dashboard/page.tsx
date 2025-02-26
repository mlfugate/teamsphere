"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import ChatChannel from "../components/ChatChannel";

export default function Dashboard() {
  return (
    <div>
      <SignedOut>
        <h1>Sign in to access your dashboard</h1>
        <p></p>
      </SignedOut>
      <SignedIn>
        <h1>Welcome to your dashboard</h1>
        <p>You are Signed In!</p>
        <ChatChannel />
      </SignedIn>
    </div>
  );
}
