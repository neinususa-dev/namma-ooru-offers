import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Mail } from "lucide-react";

export function DisabledUserMessage() {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Account Disabled</strong>
        <br />
        Your account has been temporarily disabled. Please contact our support team at{' '}
        <a 
          href="mailto:nammaooruoffers.official@gmail.com"
          className="inline-flex items-center text-red-900 underline hover:no-underline"
        >
          <Mail className="h-3 w-3 mr-1" />
          nammaooruoffers.official@gmail.com
        </a>{' '}
        for assistance.
      </AlertDescription>
    </Alert>
  );
}