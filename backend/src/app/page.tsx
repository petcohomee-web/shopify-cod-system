export default function RootPage() {
  return (
    <main style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <h1>Kapida Odeme Backend</h1>
      <p>API endpoints:</p>
      <ul>
        <li>POST /api/send-otp</li>
        <li>POST /api/verify-otp</li>
        <li>POST /api/create-order</li>
        <li>GET /api/health</li>
      </ul>
    </main>
  );
}
