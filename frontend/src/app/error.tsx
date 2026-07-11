'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dim p-6">
      <div className="card p-8 max-w-sm text-center">
        <p className="text-4xl mb-4">😔</p>
        <h2 className="text-lg font-black text-gray-900">Хатогӣ рух дод</h2>
        <p className="text-sm text-gray-500 mt-2">{error.message || 'Чизе хато шуд'}</p>
        <button type="button" onClick={reset} className="btn-brand mt-6 w-full">
          Боз кӯшиш кунед
        </button>
        <a href="/" className="btn-ghost mt-3 w-full inline-flex">Ба асосӣ</a>
      </div>
    </div>
  );
}
