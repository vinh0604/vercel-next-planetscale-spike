import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav className="flex">
        <Link href="/">
          <img className='object-scale-down h-32 w-32' alt='Home' src='/static/marpad.png'/>
        </Link>
      </nav>
    </header>
    <main>
      {children}
    </main>
    <footer></footer>
  </div>
)

export default Layout
