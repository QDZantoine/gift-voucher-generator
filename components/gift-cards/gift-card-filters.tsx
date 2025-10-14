"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GiftCardStatus } from "@/lib/types/gift-card";
import { Search } from "lucide-react";

interface GiftCardFiltersProps {
  status: GiftCardStatus | "all";
  onStatusChange: (status: GiftCardStatus | "all") => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function GiftCardFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: GiftCardFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Rechercher</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Code, email destinataire ou acheteur..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="used">Utilisés</SelectItem>
            <SelectItem value="expired">Expirés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

