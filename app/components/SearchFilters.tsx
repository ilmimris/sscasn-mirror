import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Translation } from "@/app/locales";

interface SearchFiltersProps {
  updateFilter: (key: string, value: string) => void;
  t: Translation;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  updateFilter,
  t,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [educationOptions, setEducationOptions] = useState<
    Array<{ id: string | number; nama: string }>
  >([]);
  const [majorOptions, setMajorOptions] = useState<
    Array<{ id: string | number; nama: string }>
  >([]);
  const [govtAgenciesOptions, setGovtAgenciesOptions] = useState<
    Array<{ id: string | number; nama: string }>
  >([]);
  const [openCombobox, setOpenCombobox] = useState({
    education: false,
    major: false,
    agency: false,
    jobType: false,
  });
  const [selectedValues, setSelectedValues] = useState({
    education: { id: "", nama: "" },
    major: { id: "", nama: "" },
    agency: { id: "", nama: "" },
    jobType: { id: "", nama: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [educationData, agenciesData] = await Promise.all([
          fetch("/api/educations", { next: { revalidate: 86400 } }).then((res) => res.json()),
          fetch("/api/govt-agencies", { next: { revalidate: 86400 } }).then((res) => res.json()),
        ]);

        setEducationOptions(
          Array.isArray(educationData.data) ? educationData.data : []
        );
        setGovtAgenciesOptions(
          Array.isArray(agenciesData.data) ? agenciesData.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setEducationOptions([]);
        setGovtAgenciesOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log({ educationLevel: selectedValues.education})
    const fetchData = async (id: string) => {
      try {
        const majorData = await fetch(`/api/majors/${id}`, { next: { revalidate: 86400 } }).then((res) => res.json());
        setMajorOptions(Array.isArray(majorData.data) ? majorData.data : []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setMajorOptions([]);
       
      } 
    };

    fetchData(selectedValues.education.id);
  }, [selectedValues.education]);

  const Combobox = ({
    type,
    options,
    placeholder,
  }: {
    type: keyof typeof openCombobox;
    options: Array<{ id: string | number; nama: string }>;
    placeholder: string;
  }) => {
    if (!Array.isArray(options)) {
      console.error(`Options for ${type} is not an array:`, options);
      return null;
    }

    return (
      <Popover
        open={openCombobox[type]}
        onOpenChange={(open: boolean) =>
          setOpenCombobox((prev) => ({ ...prev, [type]: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox[type]}
            className="w-full justify-between"
          >
            {selectedValues[type].nama || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Cari ${placeholder}...`} />
            <CommandList>
            <CommandEmpty>Tidak ada hasil.</CommandEmpty>
            <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setSelectedValues((prev) => ({
                        ...prev,
                        [type]: {id: option.id, nama: option.nama},
                      }));
                      setOpenCombobox((prev) => ({ ...prev, [type]: false }));
                      updateFilter(type, option.nama);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues[type].nama === option.nama
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.nama}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Memuat...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Combobox
        type="education"
        options={educationOptions}
        placeholder={t.education}
      />
      <Combobox
        type="major"
        options={majorOptions}
        placeholder={t.majorStudy}
      />
      <Combobox
        type="agency"
        options={govtAgenciesOptions}
        placeholder={t.agency}
      />
      <Combobox
        type="jobType"
        options={[
          { id: 2, nama: "CPNS" },
          { id: 1, nama: "PPPK" },
        ]}
        placeholder={t.jobType}
      />
    </div>
  );
};
