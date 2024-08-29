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

const semanticSearch = (query: string, filters: any) => {
    console.log('Performing semantic search with:', query, filters)
    if (query === "no results") {
        return []
    }
    return [
        { id: 1, title: 'Data Analyst', agency: 'Ministry of Finance', type: 'CPNS', education: 'S-1', major: 'Statistics' },
        { id: 2, title: 'Software Engineer', agency: 'Ministry of Technology', type: 'PPPK', education: 'S-1', major: 'Computer Science' },
        { id: 3, title: 'Environmental Specialist', agency: 'Ministry of Environment', type: 'CPNS', education: 'S-2', major: 'Environmental Science' },
    ]
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