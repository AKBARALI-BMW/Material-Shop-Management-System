import Layout from "./Layout";

function ComingSoon({ title, subtitle }) {
  return (
    <Layout>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 md:py-24 text-slate-400 px-4">
        <svg className="w-10 h-10 mb-3 opacity-30" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5 8h6M5 5h6M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <p className="text-sm text-center">Coming soon — next step</p>
      </div>
    </Layout>
  );
}

