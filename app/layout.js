import { AuthProvider } from "./Providers";
import "./globals.css";

export const metadata = {
  title: "AI Recipe Generator",
  description: "An easy-to-use AI Recipe Generator website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}