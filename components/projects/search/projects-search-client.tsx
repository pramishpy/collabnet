'use client'

import { useState } from 'react'
import { SearchBar } from './search-bar'
import { FilterSidebar } from './filter-sidebar'

interface ProjectsSearchClientProps {
  availableSkills: string[]
}

export function ProjectsSearchClient({ availableSkills }: ProjectsSearchClientProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      <SearchBar onFilterToggle={() => setFilterOpen(true)} />
      <FilterSidebar
        open={filterOpen}
        onOpenChange={setFilterOpen}
        availableSkills={availableSkills}
      />
    </>
  )
}
