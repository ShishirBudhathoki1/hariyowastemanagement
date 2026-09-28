import { redirect } from 'next/navigation';

// The Hariyo Waste Management Operations System is a pure vanilla
// HTML/CSS/JavaScript application (no React, no frameworks) living in
// /public/wms/. The Next.js root simply redirects to it so the user
// sees the application at "/".
export default function Page() {
  redirect('/wms/index.html');
}
