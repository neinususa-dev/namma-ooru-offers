import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Award, AlertCircle } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { toast } from 'sonner';

interface QRScannerProps {
  onPointsAwarded?: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onPointsAwarded }) => {
  const [qrCode, setQrCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const { awardQRPoints } = useRewards();

  const handleScanCode = async () => {
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    setScanning(true);

    try {
      // Parse the QR code (assuming format: store_id:store_name)
      const [storeId, storeName] = qrCode.split(':');
      
      if (!storeId || !storeName) {
        toast.error('Invalid QR code format');
        return;
      }

      const success = await awardQRPoints(storeId, storeName);
      
      if (success) {
        toast.success(`🎉 You earned 10 points at ${storeName}!`);
        setQrCode('');
        onPointsAwarded?.();
      } else {
        toast.error('Failed to award points. Please try again.');
      }
    } catch (error) {
      console.error('QR scan error:', error);
      toast.error('An error occurred while processing the QR code');
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Scan QR Code</CardTitle>
        <CardDescription className="text-muted-foreground">
          Scan QR codes at participating stores to earn points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="qr-input" className="text-sm font-medium">
            Enter QR Code
          </label>
          <Input
            id="qr-input"
            type="text"
            placeholder="Paste QR code here..."
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            disabled={scanning}
          />
        </div>
        
        <Button 
          onClick={handleScanCode}
          disabled={scanning || !qrCode.trim()}
          className="w-full"
        >
          {scanning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Award className="w-4 h-4 mr-2" />
              Earn Points
            </>
          )}
        </Button>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to earn points:</p>
              <ul className="space-y-1 text-xs">
                <li>• Ask the store for their QR code</li>
                <li>• Enter the code in the field above</li>
                <li>• Earn 10 points per scan</li>
                <li>• One scan per store per day</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};