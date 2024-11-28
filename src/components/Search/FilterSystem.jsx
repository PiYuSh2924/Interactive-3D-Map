import React, { useState } from 'react'
import { Button } from "../ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu"

const FILTER_OPTIONS = [
  { id: 'cities', label: 'Cities' },
  { id: 'landmarks', label: 'Landmarks' },
  { id: 'nature', label: 'Nature' },
  { id: 'historical', label: 'Historical' },
  { id: 'cultural', label: 'Cultural' }
]

export default function FilterSystem({ activeFilters = [], onFilterChange }) {
  const [open, setOpen] = useState(false)

  const toggleFilter = (filterId) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(id => id !== filterId))
    } else {
      onFilterChange([...activeFilters, filterId])
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full h-10 sm:h-12 justify-between bg-blue-500 hover:bg-blue-600 
                     text-white border-none transform transition-all duration-200 
                     active:scale-95"
        >
          Filters ({activeFilters.length})
          <span className="ml-2 transition-transform duration-200 
                         transform group-data-[state=open]:rotate-180">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[200px] bg-white/90 backdrop-blur-md"
        align="end"
      >
        <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FILTER_OPTIONS.map((filter) => (
          <DropdownMenuCheckboxItem
            key={filter.id}
            checked={activeFilters.includes(filter.id)}
            onCheckedChange={() => toggleFilter(filter.id)}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
