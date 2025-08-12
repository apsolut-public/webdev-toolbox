
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Beaker, Zap, Calculator, Link, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LaboratoryTools = () => {
  const [energy, setEnergy] = useState(100);
  const [restoreResult, setRestoreResult] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [shares, setShares] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [breakeven, setBreakeven] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const { toast } = useToast();

  const restoreEnergy = () => {
    const restoreAmount = Math.min(energy * 0.3, 30);
    const newEnergy = Math.min(100, energy + restoreAmount);
    setEnergy(newEnergy);
    setRestoreResult(`Energy restored! +${restoreAmount.toFixed(1)} energy. Current: ${newEnergy.toFixed(1)}/100`);
    toast({ title: "Energy restored!", description: `+${restoreAmount.toFixed(1)} energy points` });
  };

  const calculateBreakeven = () => {
    const buy = parseFloat(buyPrice);
    const shareCount = parseFloat(shares);
    const current = parseFloat(currentPrice);

    if (isNaN(buy) || isNaN(shareCount) || isNaN(current)) {
      toast({ title: "Invalid input", description: "Please enter valid numbers", variant: "destructive" });
      return;
    }

    const totalCost = buy * shareCount;
    const currentValue = current * shareCount;
    const profitLoss = currentValue - totalCost;
    const profitLossPercent = ((profitLoss / totalCost) * 100);
    const breakevenPrice = buy;

    setBreakeven(`
Total Cost: $${totalCost.toFixed(2)}
Current Value: $${currentValue.toFixed(2)}
Profit/Loss: $${profitLoss.toFixed(2)} (${profitLossPercent.toFixed(2)}%)
Breakeven Price: $${breakevenPrice.toFixed(2)}
Status: ${profitLoss >= 0 ? 'Profit' : 'Loss'}
    `.trim());

    toast({ title: "Breakeven calculated!", description: `${profitLoss >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(profitLoss).toFixed(2)}` });
  };

  const generateShortLink = () => {
    if (!originalUrl) {
      toast({ title: "No URL", description: "Please enter a URL to shorten", variant: "destructive" });
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
      return;
    }

    // Generate a random short code
    const shortCode = Math.random().toString(36).substring(2, 8);
    const generated = `https://short.ly/${shortCode}`;
    setShortUrl(generated);
    toast({ title: "Short link generated!" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="energy">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="energy">Energy Restorer</TabsTrigger>
          <TabsTrigger value="stock">Stock Calculator</TabsTrigger>
          <TabsTrigger value="shortlink">Short Link</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Restorer
              </CardTitle>
              <CardDescription>Restore your energy levels with this experimental tool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="energy-level">Current Energy Level</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      id="energy-level"
                      type="range"
                      min="0"
                      max="100"
                      value={energy}
                      onChange={(e) => setEnergy(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-mono text-lg min-w-[4rem]">{energy}/100</span>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${energy}%` }}
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Energy restoration efficiency: {energy < 50 ? 'High' : energy < 80 ? 'Medium' : 'Low'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estimated restore amount: +{Math.min(energy * 0.3, 30).toFixed(1)} energy
                  </p>
                </div>

                <Button 
                  onClick={restoreEnergy} 
                  className="w-full" 
                  disabled={energy >= 100}
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {energy >= 100 ? 'Energy Full' : 'Restore Energy'}
                </Button>

                {restoreResult && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-mono">{restoreResult}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Stock Breakeven Calculator
              </CardTitle>
              <CardDescription>Calculate your stock investment breakeven point and profit/loss</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="buy-price">Buy Price per Share</Label>
                  <Input
                    id="buy-price"
                    type="number"
                    placeholder="e.g., 150.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="shares">Number of Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="e.g., 100"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="current-price">Current Price per Share</Label>
                  <Input
                    id="current-price"
                    type="number"
                    placeholder="e.g., 165.00"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <Button onClick={calculateBreakeven} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Breakeven
              </Button>

              {breakeven && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{breakeven}</pre>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">How it works:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Breakeven price equals your original buy price per share</li>
                    <li>• Profit occurs when current price {'>'} buy price</li>
                    <li>• Loss occurs when current price {'<'} buy price</li>
                    <li>• Percentage return = (Current Value - Total Cost) / Total Cost × 100</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortlink" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Short Link Generator
              </CardTitle>
              <CardDescription>Generate shortened URLs for easier sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="original-url">Original URL</Label>
                <Input
                  id="original-url"
                  type="url"
                  placeholder="https://example.com/very/long/url/path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>

              <Button onClick={generateShortLink} className="w-full">
                <Link className="h-4 w-4 mr-2" />
                Generate Short Link
              </Button>

              {shortUrl && (
                <div className="space-y-2">
                  <Label>Generated Short URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shortUrl}
                      readOnly
                      className="font-mono bg-muted"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(shortUrl)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <Card className="bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">Note:</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a demo short link generator. In a real application, you would integrate with 
                    services like Bitly, TinyURL, or build your own URL shortening service with a database 
                    to track and redirect the short URLs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">Features to implement in production:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Custom short codes</li>
                    <li>• Click tracking and analytics</li>
                    <li>• Expiration dates</li>
                    <li>• Password protection</li>
                    <li>• QR code generation</li>
                    <li>• Bulk URL shortening</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaboratoryTools;
