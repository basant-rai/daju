export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <header className="bg-white border-b border-stone-200 px-7 h-14 flex items-center flex-shrink-0">
        <h1 className="font-semibold text-stone-800">Settings</h1>
      </header>
      <div className="flex-1 p-4 lg:p-7">
        <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-lg space-y-4">
          <h2 className="font-semibold text-stone-800">Organization</h2>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Organization Name</label>
            <input
              type="text"
              defaultValue={process.env.NEXT_PUBLIC_ORG_NAME ?? ''}
              placeholder="My Gym"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            />
          </div>
          <p className="text-xs text-stone-400">
            Update <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">NEXT_PUBLIC_ORG_NAME</code> in your{' '}
            <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">.env.local</code> to change the name permanently.
          </p>
        </div>
      </div>
    </div>
  )
}
