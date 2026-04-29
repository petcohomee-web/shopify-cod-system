'use client'

import { useRouter } from 'next/navigation'

export default function AppNav() {
  const router = useRouter()

  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      <button onClick={() => router.push("/")}>Kontrol Paneli</button>
      <button onClick={() => router.push("/form-designer")}>Form Tasarımcısı</button>
    </div>
  )
}