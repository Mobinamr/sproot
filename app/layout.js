import Header from './components/Header'
import Sidebar from './components/Sidebar'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <div className="app-container">
          <Header />
          <div className="main-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}