import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-100 bg-white/85 shadow-2xl shadow-emerald-900/10 backdrop-blur p-8 md:p-12 text-center">
        <p className="text-xs md:text-sm tracking-[0.2em] font-semibold text-emerald-700 mb-3">CHAT TCC</p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
          Monitoramento inteligente para agricultura de precisao
        </h1>
        <p className="text-slate-600 text-sm md:text-base mb-8">
          Converse com os dados dos sensores, acompanhe tendencias e tome decisoes com mais agilidade.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center bg-emerald-600 text-white py-3 px-7 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          Entrar na plataforma
        </Link>
      </div>
    </div>
  );
}
