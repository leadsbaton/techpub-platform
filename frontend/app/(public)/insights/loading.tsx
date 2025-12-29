export default function InsightsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="skeleton h-12 w-64 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card bg-base-100 shadow-xl">
            <div className="skeleton h-48 w-full"></div>
            <div className="card-body">
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

