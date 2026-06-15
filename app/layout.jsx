import React from 'react'
import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'ChatTcc',
  description: 'Aplicação ChatTcc',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
