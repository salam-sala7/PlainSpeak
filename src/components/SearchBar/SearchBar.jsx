import { categories } from '../../features/terms/terms'

export default function SearchBar({ search, onSearch, category, onCategory }) {
  return (
    <div className="search-bar" role="search">
      <label>Search terms<input type="search" value={search} onChange={event => onSearch(event.target.value)} /></label>
      <label>Category<select value={category} onChange={event => onCategory(event.target.value)}>
        <option value="">All categories</option>
        {categories.map(name => <option key={name}>{name}</option>)}
      </select></label>
    </div>
  )
}
