import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { XrayUploader } from "@/components/dashboard/XrayUploader";

export default function Upload() {
  return (
    <>
      <div className="space-y-8">
        <DashboardHeader
          heading="Upload X-ray"
          description="Upload your X-ray images for AI-powered analysis and reporting"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <XrayUploader />
          </div>
          <div>
            <div className="p-6 bg-muted rounded-lg space-y-4">
              <h2 className="font-semibold text-lg">Supported File Types</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>JPEG/JPG</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>PNG</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>DICOM</span>
                </li>
              </ul>
              
              <h2 className="font-semibold text-lg mt-6">How It Works</h2>
              <ol className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">1</div>
                  <span>Upload your X-ray image</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">2</div>
                  <span>Our AI analyzes the image</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">3</div>
                  <span>Receive detailed report</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">4</div>
                  <span>Share with your doctor</span>
                </li>
              </ol>
              
              <div className="border-t pt-4 mt-6 text-sm text-muted-foreground">
                <p>For better results, ensure your X-ray image is clear and properly oriented.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
