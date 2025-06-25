export default function TestPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="text-[#a1a1a1] mb-4">If you can see this, CSS is loading correctly.</p>
        <div className="flex gap-4 justify-center">
          <div className="w-20 h-20 bg-[#007acc] rounded"></div>
          <div className="w-20 h-20 bg-[#569cd6] rounded"></div>
          <div className="w-20 h-20 bg-[#4ec9b0] rounded"></div>
        </div>
      </div>
    </div>
  )
}