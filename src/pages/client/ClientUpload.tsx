
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientSidebar from "@/components/sidebar/ClientSidebar";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import { useAppSelector } from "@/lib/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  workflowType: z.string().min(1, { message: "Please select a workflow type." }),
  priority: z.enum(["low", "medium", "high"], { required_error: "Please select a priority." }),
  notes: z.string().optional(),
});

export default function ClientUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { workflows } = useAppSelector((state) => state.dashboard);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      workflowType: "",
      priority: "medium",
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
        description: "Your document has been uploaded and a workflow has been created.",
      });
      
      navigate("/client/workflows");
      setIsUploading(false);
    }, 1500);
  }

  const workflowTypes = [
    { id: "1", label: "Contract Review" },
    { id: "2", label: "Annual Report" },
    { id: "3", label: "Marketing Material" },
    { id: "4", label: "Technical Documentation" },
  ];

  return (
    <DashboardLayout sidebar={<ClientSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Document</h1>
          <p className="text-muted-foreground">
            Upload a document to start a new workflow.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Document Upload</CardTitle>
            <CardDescription>
              Upload your document and provide additional information to start the workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter document title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workflowType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workflow type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workflowTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
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
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Document Upload</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6">
                    <DocumentUploader
                      onFileSelected={(selectedFile) => setFile(selectedFile)}
                      maxSize={10}
                      acceptedTypes={[".pdf", ".docx", ".doc"]}
                    />
                    {file && (
                      <div className="flex items-center gap-2 mt-4 p-2 bg-muted/30 rounded">
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
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter any additional notes (optional)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide any specific instructions or requirements for this document.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    By uploading this document, you agree to our terms and conditions regarding document handling and processing.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => navigate("/client")}>
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
                        Upload and Start Workflow
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
