'use client';

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="container">
      {children}
    </div>
  )
}
