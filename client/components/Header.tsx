import Link from 'next/link';

export default function Header({ currentUser }: {currentUser: any}) {
  const links = [
    !currentUser && { label: 'Sing Up', href: '/auth/signup' },
    !currentUser && { label: 'Sing In', href: '/auth/signin' },
    currentUser && { label: 'Sell Item', href: '/items/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sing Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        Auction
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
