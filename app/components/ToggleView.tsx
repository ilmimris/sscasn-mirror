import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Grid, List } from "lucide-react"
import { Translation } from "@/app/locales"
import { ViewMode } from "@/app/types";

interface ViewToggleProps {
    viewMode: ViewMode;
    setViewMode: (viewMode: ViewMode) => void;
    t: Translation;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode, t }) => {
    return (
      <div className="flex justify-end">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label={t.gridView}>
                  <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label={t.tableView}>
                  <List className="h-4 w-4" />
              </ToggleGroupItem>
          </ToggleGroup>
      </div>
    )
  }