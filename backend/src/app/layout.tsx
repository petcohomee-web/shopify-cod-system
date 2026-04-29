import AppNav from "./AppNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0 }}>
        <AppNav />
        {children}
      </body>
    </html>
  );
}