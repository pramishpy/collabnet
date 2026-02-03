'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface FilterSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableSkills: string[]
}

export function FilterSidebar({ open, onOpenChange, availableSkills }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skills')?.split(',').filter(Boolean) || []
  )
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.get('status')?.split(',').filter(Boolean) || ['recruiting']
  )

  const statusOptions = [
    { value: 'recruiting', label: 'Recruiting' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ]

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedSkills.length > 0) {
      params.set('skills', selectedSkills.join(','))
    } else {
      params.delete('skills')
    }
    
    if (selectedStatus.length > 0) {
      params.set('status', selectedStatus.join(','))
    } else {
      params.delete('status')
    }
    
    router.push(`${pathname}?${params.toString()}`)
    onOpenChange(false)
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedStatus(['recruiting'])
    const params = new URLSearchParams(searchParams.toString())
    params.delete('skills')
    params.delete('status')
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Projects</SheetTitle>
          <SheetDescription>
            Refine your search by skills and status
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedStatus.includes(option.value)}
                  onCheckedChange={() => toggleStatus(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {/* Skills Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Skills</Label>
            <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedSkills.length > 0 || selectedStatus.length !== 1) && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {selectedStatus.map((status) => (
                  <Badge key={status} variant="secondary" className="capitalize">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={clearFilters} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
