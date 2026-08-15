export function SkeletonLine({ width = "100%" }) {
  return <div className="skeleton-line" style={{ width }} />;
}

export function SkeletonCard() {
  return (
    <div className="card space-y-2">
      <SkeletonLine width="35%" />
      <SkeletonLine width="80%" />
      <SkeletonLine width="60%" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonForm({ rows = 4 }) {
  return (
    <div className="card space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <SkeletonLine width="25%" />
          <div className="skeleton-line" style={{ height: "2.3rem" }} />
        </div>
      ))}
    </div>
  );
}
