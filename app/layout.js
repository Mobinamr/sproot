import Sidebar from './components/Sidebar'
import MenuToggle from './components/MenuToggle'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <div className="app-container">
          <MenuToggle />
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}