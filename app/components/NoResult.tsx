import { Coffee } from "lucide-react";
import { Translation } from "@/app/locales";
import { Button } from "@/components/ui/button";

export const NoResults: React.FC<{ t: Translation }> = ({ t }) => (
    <div className="text-center py-10">
        <Coffee className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{t.noResults}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.noResultsDesc}</p>
        <div className="mt-6">
            <Button onClick={() => window.location.reload()}>
                {t.refresh}
            </Button>
        </div>
    </div>
)