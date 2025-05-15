
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DraftTeamSidebar from "@/components/sidebar/DraftTeamSidebar";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import { useAppSelector } from "@/lib/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Upload } from "lucide-react";

const formSchema = z.object({
  workflowId: z.string({ required_error: "Please select a workflow." }),
  version: z.string({ required_error: "Please enter a version number." }),
  notes: z.string().optional(),
});

export default function DraftUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { workflows } = useAppSelector((state) => state.dashboard);
  
  // Filter workflows for draft team
  const draftWorkflows = workflows.filter(w => w.status === "draft");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflowId: "",
      version: "1.0",
      notes: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a document before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded for QC review.",
      });
      
      navigate("/draft/assigned");
      setIsUploading(false);
    }, 1500);
  }

  return (
    <DashboardLayout sidebar={<DraftTeamSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Converted Document</h1>
          <p className="text-muted-foreground">
            Upload your completed draft document for QC review.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Upload your converted document to proceed with the workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="workflowId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Workflow</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workflow" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {draftWorkflows.map((workflow) => (
                            <SelectItem key={workflow.id} value={workflow.id}>
                              {workflow.title} ({workflow.clientName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 1.0, 1.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel htmlFor="file-upload">Document Upload</FormLabel>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6">
                    <DocumentUploader
                      onFileSelected={(selectedFile) => setFile(selectedFile)}
                      maxSize={10}
                      acceptedTypes={[".pdf", ".docx", ".doc"]}
                    />
                    {file && (
                      <div className="flex items-center gap-2 mt-4 p-2 bg-muted/30 rounded">
                        <FileText className="h-4 w-4" />
                        <div className="text-sm">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes for QC Team</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any notes for the QC team reviewing your document..." 
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => navigate("/draft/assigned")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload for QC Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
