import { Badge } from "@/components/ui/badge";
import { Mail, MailCheck, MailX } from "lucide-react";

interface EmailStatusBadgeProps {
  emailSent: boolean;
  recipientEmail: string;
}

export function EmailStatusBadge({
  emailSent,
  recipientEmail,
}: EmailStatusBadgeProps) {
  if (emailSent) {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-100"
      >
        <MailCheck className="h-3 w-3 mr-1" />
        Email envoyé
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    >
      <MailX className="h-3 w-3 mr-1" />
      Email non envoyé
    </Badge>
  );
}
