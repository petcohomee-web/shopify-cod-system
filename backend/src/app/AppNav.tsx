"use client";

import React from "react";

export default function AppNav() {
  return React.createElement(
    "ui-nav-menu",
    null,
    React.createElement("a", { href: "/", rel: "home" }, "Kontrol Paneli"),
    React.createElement("a", { href: "/form-designer" }, "Form Tasarımcısı"),
    React.createElement("a", { href: "/fraud" }, "Dolandırıcılık Önleme"),
    React.createElement("a", { href: "/delivery" }, "Teslimat Başarısı"),
    React.createElement("a", { href: "/upsell" }, "Satış Artırıcı"),
    React.createElement("a", { href: "/analytics" }, "Analitik"),
    React.createElement("a", { href: "/settings" }, "Ayarlar ve Entegrasyonlar"),
    React.createElement("a", { href: "/billing" }, "Fatura Planları")
  );
}