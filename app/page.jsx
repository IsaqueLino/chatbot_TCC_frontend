import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redireciona a rota raiz para /login
  redirect('/login');
}
