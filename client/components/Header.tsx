import { getCurrentUser } from '@/lib/actions';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Header({ currentUser }: {currentUser: any}) {


  if (!currentUser) {
    const cookieStore = cookies();
    const session = cookieStore.get('session');
    const cookie = `session=${session?.value}`;

    console.log('HEADER ================ cookie', cookie);
    const data = await getCurrentUser(cookie);
    currentUser = data?.currentUser;
  }

  console.log('Header: currentUser', currentUser);

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
