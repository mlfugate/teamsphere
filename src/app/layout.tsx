import { metadata } from "./metadata";
import Head from "next/head";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import UserRedirect from "./components/UserRedirect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </Head>
        <body>
          <UserRedirect />

          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            {children}
            <UserButton />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
