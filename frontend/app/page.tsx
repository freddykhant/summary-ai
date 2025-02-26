"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const summaryResponse = await fetch("http://localhost:5050/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name }),
        });

        if (summaryResponse.ok) {
          const data = await summaryResponse.json();
          setSummary(data.summary);
        } else {
          console.error("Failed to get summary");
        }
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Summary AI 🧠</CardTitle>
          <CardDescription>Upload a CSV file to get a summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label className="font-semibold" htmlFor="file">
                Upload CSV
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  className="font-medium text-gray-600"
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <Button
                  className="font-semibold"
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className="font-semibold" htmlFor="summary">
                Summary
              </Label>
              <Textarea
                id="summary"
                placeholder="Your summary will appear here..."
                value={summary}
                readOnly
                className="h-40"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="font-semibold"
            variant="outline"
            onClick={() => setSummary("")}
          >
            Clear Summary
          </Button>
          {file && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
