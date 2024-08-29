'use client'

import React, { useState, useContext } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, Language } from '@/app/locales';
import { AppContext } from '@/app/contexts/AppContext'
import { SearchResults } from '@/app/components/SearchResults'
import { JobResult, ViewMode } from '@/app/types'
import { SearchFilters } from '@/app/components/SearchFilters'
import { SemanticSearch } from '@/app/components/SemanticSearch'
import { ViewToggle } from '@/app/components/ToggleView'

export default function Home() {

    const { language, setLanguage, isDarkMode, toggleDarkMode } = useContext(AppContext);
    const t = translations[language as Language];

    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({
        education: '',
        major: '',
        agency: '',
        jobType: '',
    })
    const [results, setResults] = useState<JobResult[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    

    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
            <div className={`container mx-auto p-4 space-y-6 ${isDarkMode ? 'dark' : ''}`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-center dark:text-white">{t.title}</h1>
      
                    <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                        </Button>
                        <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'id')}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue><Globe className="h-4 w-4 inline-block mr-2" />{language.toUpperCase()}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="id">ID</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SemanticSearch t={t} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setResults={setResults} />

                <SearchFilters updateFilter={updateFilter} t={t} />

                {results.length > 0 && <ViewToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />}

                <SearchResults results={results} viewMode={viewMode as "grid" | "table"} t={t} />
            </div>
    )
}