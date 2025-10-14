"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ExclusionPeriodFiltersProps {
  search: string;
  isRecurring: string;
  onSearchChange: (value: string) => void;
  onIsRecurringChange: (value: string) => void;
}

export function ExclusionPeriodFilters({
  search,
  isRecurring,
  onSearchChange,
  onIsRecurringChange,
}: ExclusionPeriodFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={isRecurring} onValueChange={onIsRecurringChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="true">Récurrentes</SelectItem>
          <SelectItem value="false">Ponctuelles</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
