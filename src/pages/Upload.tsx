import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface SalesData {
  [key: string]: any;
}

const REQUIRED_COLUMNS = [
  "Sales Org", "Plant", "Customer Code", "Customer Name", "Customer Reference",
  "Type", "Document Type", "Sales Posting Date", "Sales Doc No", "Sales Doc Date",
  "Sales Order No", "Sales Order Date", "Item Code", "Item Name", "Quantity",
  "Unit Price", "Quantity x Price", "CGST", "SGST", "IGST", "Document Total",
  "WP", "Mega Watts", "Price Unit(Price/WP)", "Delivery Challan Doc No",
  "Delivery Challan Doc Date", "LR No", "LR Date", "Vehicle No", "Transporter Name",
  "Transporter Contact No.", "Sales Employee", "Sales Emp.Name", "Segment",
  "Company Code", "Billing Doc.No", "Product Type", "Billing type", "Division",
  "Distribution Channel", "Sales FI Doc No", "Sales Creation Date",
  "Delivery Challan FI Doc No", "Delivery Challan Posting Date",
  "PO number (Customer reference)", "SO.Item No.", "Sales Person", "FY Year",
  "FY_Quarter", "CY_Quarter", "City", "Region", "Bill To_GSTIN", "Ship To_GSTIN",
  "PAN Number", "Item Number", "Profit Center", "Profit Center Name",
  "Business Place", "Material type", "Material Group", "Item GROUP", "HSN",
  "GL Code", "Currency Type", "Ex Rate", "Line Discount%", "Line Discount Amount",
  "After Discount in LC", "Tax Code", "Freight", "Insurance", "TCS Rate",
  "TCS Amount", "TCS Section", "GST Rate", "IRN Number", "IRN date",
  "IRN Generation Date", "IRN Acknowledgment No", "E-way Bill No", "E-way Bill Dat",
  "Sold to Party Code", "Sold to party Name", "Sold to Party Address",
  "Sold to Party Region", "Sold to Party Postal Code", "Sold to Party City",
  "Ship to Party Code", "Ship to Party Name", "Ship to Party Address",
  "Ship to Party Region", "Ship to Party Postal Code", "Ship to Party City",
  "Incoterms", "Terms of payment"
];

const EXCLUSION_NAMES: string[] = [];

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateColumns = (columns: string[]): boolean => {
    const missingColumns = REQUIRED_COLUMNS.filter(col => !columns.includes(col));
    if (missingColumns.length > 0) {
      toast({
        title: "Invalid File Structure",
        description: `Missing columns: ${missingColumns.slice(0, 3).join(", ")}${missingColumns.length > 3 ? "..." : ""}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const processExcelData = (data: any[]): SalesData[] => {
    const processedData: SalesData[] = [];

    data.forEach((row) => {
      const customerName = row["Customer Name"];
      
      if (EXCLUSION_NAMES.includes(customerName)) {
        return;
      }

      const quantityPrice = parseFloat(row["Quantity x Price"]) || 0;
      const exRate = parseFloat(row["Ex Rate"]) || 1;
      const computedPrice = quantityPrice * exRate;

      const processedRow = { ...row, "Computed Price": computedPrice };
      processedData.push(processedRow);
    });

    return processedData;
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only .xlsx files",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(firstSheet);

      if (rawData.length === 0) {
        throw new Error("File is empty");
      }

      const columns = Object.keys(rawData[0] as object);
      
      if (!validateColumns(columns)) {
        setIsProcessing(false);
        return;
      }

      const processedData = processExcelData(rawData);
      
      localStorage.setItem("salesData", JSON.stringify(processedData));

      setUploadSuccess(true);
      toast({
        title: "Success!",
        description: `Processed ${processedData.length} records successfully`,
      });

      setTimeout(() => {
        navigate("/analytics");
      }, 1500);
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Sales Analytics Platform</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Upload Sales Data</h2>
            <p className="text-muted-foreground">Upload your Excel file to analyze sales performance</p>
          </div>

          <Card
            className={`p-8 transition-all duration-300 shadow-elegant ${
              isDragging ? "border-primary bg-primary/5 scale-[1.02]" : ""
            } ${uploadSuccess ? "border-secondary bg-secondary/5" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {uploadSuccess ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-secondary animate-in zoom-in duration-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Upload Successful!</h3>
                    <p className="text-muted-foreground">Redirecting to analytics...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <FileSpreadsheet className="w-16 h-16 text-muted-foreground" />
                    <UploadIcon className="w-8 h-8 text-primary absolute -top-2 -right-2" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {isDragging ? "Drop your file here" : "Upload Excel File"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your .xlsx file or click to browse
                    </p>
                  </div>

                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx"
                    onChange={handleFileInput}
                    disabled={isProcessing}
                  />
                  
                  <Button
                    asChild
                    size="lg"
                    disabled={isProcessing}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isProcessing ? "Processing..." : "Select File"}
                    </label>
                  </Button>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• File must be in .xlsx format</p>
                    <p>• Must contain all 96 required columns</p>
                    <p>• Data will be automatically computed and analyzed</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
