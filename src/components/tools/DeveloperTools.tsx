
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Link, Clock, Calculator, Code, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DeveloperTools = () => {
  const [urlInput, setUrlInput] = useState('');
  const [parsedUrl, setParsedUrl] = useState<any>({});
  const [timestampInput, setTimestampInput] = useState('');
  const [timestampOutput, setTimestampOutput] = useState('');
  const [numberInput, setNumberInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('16');
  const [convertedNumber, setConvertedNumber] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [decodedJwt, setDecodedJwt] = useState('');
  const { toast } = useToast();

  const parseURL = () => {
    try {
      const url = new URL(urlInput);
      const parsed = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 'default',
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        searchParams: Object.fromEntries(url.searchParams)
      };
      setParsedUrl(parsed);
      toast({ title: "URL parsed successfully!" });
    } catch (error) {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
      setParsedUrl({});
    }
  };

  const convertTimestamp = () => {
    try {
      let timestamp: number;
      
      if (timestampInput.includes('-') || timestampInput.includes('/')) {
        // Assume it's a date string
        timestamp = new Date(timestampInput).getTime();
      } else {
        // Assume it's a Unix timestamp
        timestamp = parseInt(timestampInput);
        if (timestampInput.length === 10) {
          timestamp *= 1000; // Convert seconds to milliseconds
        }
      }

      if (isNaN(timestamp)) {
        throw new Error('Invalid timestamp');
      }

      const date = new Date(timestamp);
      const result = {
        unix: Math.floor(timestamp / 1000),
        unixMs: timestamp,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toString(),
        relative: getRelativeTime(date)
      };

      setTimestampOutput(JSON.stringify(result, null, 2));
      toast({ title: "Timestamp converted successfully!" });
    } catch (error) {
      toast({ title: "Conversion failed", description: "Invalid timestamp format", variant: "destructive" });
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const convertBase = () => {
    try {
      const decimal = parseInt(numberInput, parseInt(fromBase));
      if (isNaN(decimal)) {
        throw new Error('Invalid number');
      }
      
      const result = decimal.toString(parseInt(toBase)).toUpperCase();
      setConvertedNumber(result);
      toast({ title: "Base conversion successful!" });
    } catch (error) {
      toast({ title: "Conversion failed", description: "Invalid number format", variant: "destructive" });
    }
  };

  const decodeJWT = () => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      const decoded = {
        header,
        payload,
        signature: parts[2]
      };

      setDecodedJwt(JSON.stringify(decoded, null, 2));
      toast({ title: "JWT decoded successfully!" });
    } catch (error) {
      toast({ title: "Decoding failed", description: "Invalid JWT token", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="url">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="url">URL Parser</TabsTrigger>
          <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
          <TabsTrigger value="base">Base Convert</TabsTrigger>
          <TabsTrigger value="jwt">JWT Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                URL Parser
              </CardTitle>
              <CardDescription>Parse and analyze URL components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">URL to Parse</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/path?param=value#section"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={parseURL}>
                    Parse
                  </Button>
                </div>
              </div>

              {Object.keys(parsedUrl).length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">Basic Components</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Protocol:</span> {parsedUrl.protocol}</div>
                          <div><span className="font-medium">Hostname:</span> {parsedUrl.hostname}</div>
                          <div><span className="font-medium">Port:</span> {parsedUrl.port}</div>
                          <div><span className="font-medium">Pathname:</span> {parsedUrl.pathname}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">Query & Fragment</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Search:</span> {parsedUrl.search || 'None'}</div>
                          <div><span className="font-medium">Hash:</span> {parsedUrl.hash || 'None'}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {Object.keys(parsedUrl.searchParams).length > 0 && (
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">Query Parameters</h4>
                        <div className="space-y-1">
                          {Object.entries(parsedUrl.searchParams).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timestamp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timestamp Converter
              </CardTitle>
              <CardDescription>Convert between timestamps and human-readable dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Timestamp or Date</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="1640995200 or 2022-01-01 or 2022-01-01T00:00:00Z"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={convertTimestamp}>
                    Convert
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setTimestampInput(Date.now().toString())}>
                  Current Time (ms)
                </Button>
                <Button variant="outline" onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}>
                  Current Time (s)
                </Button>
              </div>

              {timestampOutput && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Converted Formats</label>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(timestampOutput)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={timestampOutput}
                    readOnly
                    className="min-h-[200px] font-mono text-sm bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="base" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Base Converter
              </CardTitle>
              <CardDescription>Convert numbers between different bases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">From Base</label>
                  <Select value={fromBase} onValueChange={setFromBase}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Binary (2)</SelectItem>
                      <SelectItem value="8">Octal (8)</SelectItem>
                      <SelectItem value="10">Decimal (10)</SelectItem>
                      <SelectItem value="16">Hexadecimal (16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">To Base</label>
                  <Select value={toBase} onValueChange={setToBase}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Binary (2)</SelectItem>
                      <SelectItem value="8">Octal (8)</SelectItem>
                      <SelectItem value="10">Decimal (10)</SelectItem>
                      <SelectItem value="16">Hexadecimal (16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Number</label>
                  <Input
                    placeholder="Enter number to convert"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={convertBase} className="w-full">
                Convert
              </Button>

              {convertedNumber && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Result</label>
                  <div className="flex gap-2">
                    <Input
                      value={convertedNumber}
                      readOnly
                      className="font-mono bg-muted"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard(convertedNumber)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jwt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                JWT Decoder
              </CardTitle>
              <CardDescription>Decode JSON Web Tokens to inspect their contents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">JWT Token</label>
                <Textarea
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={jwtToken}
                  onChange={(e) => setJwtToken(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
                <Button onClick={decodeJWT} className="mt-2">
                  Decode JWT
                </Button>
              </div>

              {decodedJwt && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Decoded JWT</label>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodedJwt)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={decodedJwt}
                    readOnly
                    className="min-h-[300px] font-mono text-sm bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperTools;
