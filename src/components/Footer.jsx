import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home',     path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/services' },
  { label: 'About',    path: '/about' },
  { label: 'Contact',  path: '/contact' },
];

const projectLinks = [
  { label: 'Websites',      path: '/projects?category=website' },
  { label: 'Android Apps',  path: '/projects?category=android' },
  { label: 'Video Editing', path: '/projects?category=video' },
  { label: 'UI/UX Design',  path: '/projects?category=design' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{backgroundColor: '#0f172a', color: 'white', padding: '48px 24px'}}>
      <div style={{maxWidth: '1280px', margin: '0 auto'}}>
        <p style={{marginTop: '20px', fontSize: '12px', color: '#999'}}>
          © {year} Rizki Aditiya Ramadan. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}