export function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="border-l border-accent pl-3 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  )
}
