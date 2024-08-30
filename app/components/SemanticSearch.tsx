import { Translation } from "@/app/locales"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SemanticSearchProps {
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    filters: any,
    setResults: (results: any) => void,
    t: Translation
}

const semanticSearch = async (query: string, filters: any) => {
    console.log('Melakukan pencarian semantik dengan:', query, filters)
    if (query === "no results") {
        return []
    }
    
    const { agency, education, major } = filters
    
    try {
        const response = await fetch(`/api/jobs?agency_id=${agency.id}&education_id=${education.id}&major_id=${major.id}`)
        const data = await response.json()
        
        if (Array.isArray(data)) {
            return data.map(job => ({
                id: job.id,
                title: job.position_name,
                agency: job.agency_name,
                type: job.job_name + " - " + job.formation_name,
                education: job.education_level,
                major: job.education_program
            }))
        } else {
            console.error('Data yang diterima bukan array:', data)
            return []
        }
    } catch (error) {
        console.error('Kesalahan saat mengambil data pekerjaan:', error)
        return []
    }
}


export const SemanticSearch: React.FC<SemanticSearchProps> = ({ t, searchQuery, setSearchQuery, filters, setResults }) => {
    const handleSearch = () => {
        const searchResults = semanticSearch(searchQuery, filters)
        setResults(searchResults)
    }

    return (
        <div className="flex space-x-2">
            <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow dark:bg-gray-800 dark:text-white"
            />
            <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" /> {t.searchButton}
            </Button>
        </div>
    )
}