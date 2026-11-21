import { categories } from '../../features/terms/terms'

export default function SearchBar({ search, onSearch, category, onCategory }) {
  return (
    <div className="my-6 grid gap-3" role="search" aria-label="Search glossary">
      <label>Search terms<input type="search" value={search} onChange={event => onSearch(event.target.value)} /></label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
        <button type="button" className="filter-pill" aria-pressed={!category} onClick={() => onCategory('')}>
          All categories
        </button>
        {categories.map(name => (
          <button key={name} type="button" className="filter-pill" aria-pressed={category === name}
            onClick={() => onCategory(name)}>{name}</button>
        ))}
      </div>
    </div>
  )
}
