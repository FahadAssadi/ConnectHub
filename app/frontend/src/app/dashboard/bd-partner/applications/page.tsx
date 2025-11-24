"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, FileText, Calendar, AlertCircle } from "lucide-react";

// Replace with API fetch later
interface Application {
  id: string;
  company: string;
  product: string;
  status: string;
  appliedDate: string;
  expectedResponse?: string;
  stage: string;
  progress: number;
}

const statusIcon = (status: string) => {
  switch (status) {
    case "under_review":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "interview_scheduled":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "pending_documents":
      return <FileText className="h-4 w-4 text-orange-500" />;
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "under_review":
      return "Under Review";
    case "interview_scheduled":
      return "Interview Scheduled";
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

const statusVariant = (status: string) => {
  switch (status) {
    case "under_review":
      return "secondary";
    case "interview_scheduled":
      return "default";
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

export default function BDApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/protected/relationship/applications`;

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        console.log("Fetched applications:", data);

        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending")
      return ["under_review", "interview_scheduled", "pending_documents"].includes(app.status);
    if (activeTab === "approved") return app.status === "approved";
    if (activeTab === "rejected") return app.status === "rejected";
    return true;
  });

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="space-y-6">
    <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
    <p className="text-muted-foreground">Track the status of your submitted applications</p>

    <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
        {filtered.length === 0 && <p>No applications found.</p>}
        {filtered.map((app) => (
            <Card key={app.id}>
            <CardHeader className="flex justify-between items-center">
                <div>
                <CardTitle>{app.company}</CardTitle>
                <CardDescription>{app.product}</CardDescription>
                </div>
                <Badge variant={statusVariant(app.status)} className="flex items-center gap-1">
                {statusIcon(app.status)}
                {statusLabel(app.status)}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                {app.expectedResponse && (
                    <span>Expected: {new Date(app.expectedResponse).toLocaleDateString()}</span>
                )}
                </div>
                <Progress value={app.progress} className="h-2" />
                <p className="mt-1 text-sm text-muted-foreground">{app.stage}</p>
            </CardContent>
            </Card>
        ))}
        </TabsContent>
    </Tabs>
    </div>
  );
}
