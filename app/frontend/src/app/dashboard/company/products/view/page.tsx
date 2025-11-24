"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { getSession } from "@/lib/auth-client";

interface Application {
  id: string;
  bdPartnerName: string;
  status: string;
  appliedAt: string;
  stage: string;
  progress: number;
  nextStep: string;
}

interface Props {
  productId: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "under_review":
      return "Under Review";
    case "pending_documents":
      return "Documents Required";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Unknown";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "under_review":
      return "secondary";
    case "pending_documents":
      return "outline";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "under_review":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "pending_documents":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

export default function ProductApplicationsPage({ productId }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await getSession();
        const userId = data?.session?.userId;
        if (!userId) throw new Error("User not authenticated");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/protected/relationship/product/-tBUaarY-XosDLZxjmI4a/applications`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const result = await res.json();

        console.log(result);

        if (result.success && result.applications) {
          setApplications(result.applications);
        } else {
          setApplications([]);
          setError(result.error || "Failed to fetch applications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [productId]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (applications.length === 0) return <p>No applications found for this product.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Applications for Product</h1>

      {applications.map((app) => (
        <Card key={app.id}>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>{app.bdPartnerName}</CardTitle>
              <CardDescription>
                Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant(app.status)} className="flex items-center gap-1">
              {getStatusIcon(app.status)}
              {getStatusLabel(app.status)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between">
              <span>Stage: {app.stage}</span>
              <span>Next Step: {app.nextStep}</span>
            </div>
            <Progress value={app.progress} className="h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
