import AppNav from "./AppNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body style={{ margin: 0 }}>
        <AppNav />
        {children}
      </body>
    </html>
  );
}