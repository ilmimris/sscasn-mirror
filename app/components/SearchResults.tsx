import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Translation } from "@/app/locales";
import { JobResult } from "@/app/types";
import { NoResults } from "@/app/components/NoResult";

interface SearchResultsProps {
  results: JobResult[];
  viewMode: "grid" | "table";
  t: Translation;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  viewMode,
  t,
}) => {
  if (results.length === 0) return (<NoResults t={t} />)

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((job: any) => (
          <Card key={job.id} className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{job.title}</CardTitle>
              <CardDescription className="dark:text-gray-300">
                {job.agency}
              </CardDescription>
            </CardHeader>
            <CardContent className="dark:text-gray-200">
              <p>
                {t.jobType}: {job.type}
              </p>
              <p>
                {t.jobEducation}: {job.education}
              </p>
              <p>
                {t.jobMajor}: {job.major}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="dark:text-gray-200">{t.jobTitle}</TableHead>
          <TableHead className="dark:text-gray-200">{t.jobAgency}</TableHead>
          <TableHead className="dark:text-gray-200">{t.jobType}</TableHead>
          <TableHead className="dark:text-gray-200">{t.jobEducation}</TableHead>
          <TableHead className="dark:text-gray-200">{t.jobMajor}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((job: any) => (
          <TableRow key={job.id}>
            <TableCell className="dark:text-gray-200">{job.title}</TableCell>
            <TableCell className="dark:text-gray-200">{job.agency}</TableCell>
            <TableCell className="dark:text-gray-200">{job.type}</TableCell>
            <TableCell className="dark:text-gray-200">
              {job.education}
            </TableCell>
            <TableCell className="dark:text-gray-200">{job.major}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
