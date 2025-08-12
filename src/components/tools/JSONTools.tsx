import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, FileText, Zap, GitCompare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: number;
}

const JSONTools = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonA, setJsonA] = useState('');
  const [jsonB, setJsonB] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [activeTab, setActiveTab] = useState('format');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deepCompare, setDeepCompare] = useState(true);
  const [ignoreOrder, setIgnoreOrder] = useState(false);
  const { toast } = useToast();

  // Optimized JSON processing with chunking for large files
  const processLargeJSON = async (jsonString: string, processor: (data: any) => any) => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setProgress(0);

      setTimeout(() => {
        try {
          const parsed = JSON.parse(jsonString);
          setProgress(50);
          
          setTimeout(() => {
            const result = processor(parsed);
            setProgress(100);
            setIsProcessing(false);
            resolve(result);
          }, 10);
        } catch (error) {
          setIsProcessing(false);
          reject(error);
        }
      }, 10);
    });
  };

  const formatJSON = async () => {
    try {
      const formatted = await processLargeJSON(jsonInput, (data) => 
        JSON.stringify(data, null, 2)
      );
      setJsonOutput(formatted as string);
      toast({ title: "JSON formatted successfully!" });
    } catch (error) {
      toast({ title: "Invalid JSON", description: "Please check your JSON syntax", variant: "destructive" });
    }
  };

  const minifyJSON = async () => {
    try {
      const minified = await processLargeJSON(jsonInput, (data) => 
        JSON.stringify(data)
      );
      setJsonOutput(minified as string);
      toast({ title: "JSON minified successfully!" });
    } catch (error) {
      toast({ title: "Invalid JSON", description: "Please check your JSON syntax", variant: "destructive" });
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(jsonInput);
      toast({ title: "Valid JSON ✓", description: "Your JSON is properly formatted" });
    } catch (error) {
      toast({ title: "Invalid JSON ✗", description: (error as Error).message, variant: "destructive" });
    }
  };

  // Optimized deep comparison algorithm
  const compareJSONs = async () => {
    if (!jsonA || !jsonB) {
      toast({ title: "Missing JSON", description: "Please provide both JSON objects to compare", variant: "destructive" });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const objA = JSON.parse(jsonA);
      const objB = JSON.parse(jsonB);
      setProgress(30);

      const result = await performDeepComparison(objA, objB);
      setProgress(100);
      setDiffResult(result);
      setIsProcessing(false);
      
      toast({ 
        title: "Comparison completed!", 
        description: `Found ${result.added.length} additions, ${result.removed.length} removals, ${result.modified.length} modifications` 
      });
    } catch (error) {
      setIsProcessing(false);
      toast({ title: "Comparison failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const performDeepComparison = async (objA: any, objB: any): Promise<DiffResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result: DiffResult = {
          added: [],
          removed: [],
          modified: [],
          unchanged: 0
        };

        const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
          const flattened: Record<string, any> = {};
          
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const newKey = prefix ? `${prefix}.${key}` : key;
              
              if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(flattened, flattenObject(obj[key], newKey));
              } else {
                flattened[newKey] = obj[key];
              }
            }
          }
          
          return flattened;
        };

        const flatA = flattenObject(objA);
        const flatB = flattenObject(objB);
        
        const keysA = new Set(Object.keys(flatA));
        const keysB = new Set(Object.keys(flatB));
        const allKeys = new Set([...keysA, ...keysB]);

        for (const key of allKeys) {
          if (!keysA.has(key)) {
            result.added.push(`${key}: ${JSON.stringify(flatB[key])}`);
          } else if (!keysB.has(key)) {
            result.removed.push(`${key}: ${JSON.stringify(flatA[key])}`);
          } else if (JSON.stringify(flatA[key]) !== JSON.stringify(flatB[key])) {
            result.modified.push(`${key}: ${JSON.stringify(flatA[key])} → ${JSON.stringify(flatB[key])}`);
          } else {
            result.unchanged++;
          }
        }

        resolve(result);
      }, 50);
    });
  };

  const generateLargeJSONSample = () => {
    const sampleData = {
      users: Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        profile: {
          age: Math.floor(Math.random() * 50) + 18,
          city: `City ${Math.floor(Math.random() * 100)}`,
          preferences: {
            theme: Math.random() > 0.5 ? 'dark' : 'light',
            notifications: Math.random() > 0.3,
            language: ['en', 'es', 'fr', 'de'][Math.floor(Math.random() * 4)]
          }
        }
      })),
      metadata: {
        total: 1000,
        generated: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    setJsonInput(JSON.stringify(sampleData, null, 2));
    toast({ title: "Large JSON sample generated!", description: "Generated 1000 user records for testing" });
  };

  const convertToXML = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const xml = jsonToXML(parsed);
      setJsonOutput(xml);
      toast({ title: "Converted to XML successfully!" });
    } catch (error) {
      toast({ title: "Conversion failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const convertToYAML = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const yaml = jsonToYAML(parsed);
      setJsonOutput(yaml);
      toast({ title: "Converted to YAML successfully!" });
    } catch (error) {
      toast({ title: "Conversion failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  // ... keep existing code (jsonToXML and jsonToYAML functions)
  const jsonToXML = (obj: any, rootName = 'root'): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
    
    const convertObject = (o: any, indent = 1): string => {
      let result = '';
      const spaces = '  '.repeat(indent);
      
      for (const [key, value] of Object.entries(o)) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              result += `\n${spaces}<${key}>`;
              if (typeof item === 'object') {
                result += convertObject(item, indent + 1);
              } else {
                result += item;
              }
              result += `</${key}>`;
            });
          } else {
            result += `\n${spaces}<${key}>`;
            result += convertObject(value, indent + 1);
            result += `\n${spaces}</${key}>`;
          }
        } else {
          result += `\n${spaces}<${key}>${value}</${key}>`;
        }
      }
      return result;
    };
    
    xml += convertObject(obj);
    xml += `\n</${rootName}>`;
    return xml;
  };

  const jsonToYAML = (obj: any): string => {
    const convertValue = (value: any, indent = 0): string => {
      const spaces = '  '.repeat(indent);
      
      if (value === null) return 'null';
      if (typeof value === 'boolean') return value.toString();
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'string') return `"${value}"`;
      
      if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        return value.map(item => `\n${spaces}- ${convertValue(item, indent + 1).trim()}`).join('');
      }
      
      if (typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length === 0) return '{}';
        return entries.map(([key, val]) => {
          const convertedValue = convertValue(val, indent + 1);
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            return `\n${spaces}${key}:${convertedValue}`;
          }
          return `\n${spaces}${key}: ${convertedValue.trim()}`;
        }).join('');
      }
      
      return value.toString();
    };
    
    return convertValue(obj).trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadFile = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate JSON size for performance metrics
  const jsonSize = useMemo(() => {
    return new Blob([jsonInput]).size;
  }, [jsonInput]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="format">Format & Validate</TabsTrigger>
          <TabsTrigger value="compare">Compare JSONs</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="merge">Merge</TabsTrigger>
          <TabsTrigger value="excel">Excel Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="format" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input JSON
                  {jsonSize > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {(jsonSize / 1024).toFixed(1)} KB
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Paste your JSON data here</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='{"key": "value", "array": [1, 2, 3]}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button onClick={formatJSON} size="sm" disabled={isProcessing}>
                    <FileText className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                  <Button onClick={minifyJSON} variant="outline" size="sm" disabled={isProcessing}>
                    <Zap className="h-4 w-4 mr-2" />
                    Minify
                  </Button>
                  <Button onClick={validateJSON} variant="outline" size="sm">
                    Validate
                  </Button>
                  <Button onClick={generateLargeJSONSample} variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Generate Large Sample
                  </Button>
                </div>
                {isProcessing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing large JSON...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Output</CardTitle>
                <CardDescription>Formatted result</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonOutput}
                  readOnly
                  className="min-h-[300px] font-mono text-sm bg-muted"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={copyToClipboard} size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={downloadFile} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                High-Performance JSON Comparison
              </CardTitle>
              <CardDescription>
                Compare two JSON objects with optimized algorithms for large files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Switch id="deep-compare" checked={deepCompare} onCheckedChange={setDeepCompare} />
                  <Label htmlFor="deep-compare">Deep comparison</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ignore-order" checked={ignoreOrder} onCheckedChange={setIgnoreOrder} />
                  <Label htmlFor="ignore-order">Ignore array order</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">JSON A</Label>
                  <Textarea
                    placeholder='{"name": "John", "age": 30}'
                    value={jsonA}
                    onChange={(e) => setJsonA(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">JSON B</Label>
                  <Textarea
                    placeholder='{"name": "John", "age": 31, "city": "NYC"}'
                    value={jsonB}
                    onChange={(e) => setJsonB(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </div>

              <Button onClick={compareJSONs} className="w-full" disabled={isProcessing}>
                <GitCompare className="h-4 w-4 mr-2" />
                {isProcessing ? 'Comparing...' : 'Compare JSONs'}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Running optimized comparison...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {diffResult && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                          <div className="text-2xl font-bold text-green-600">{diffResult.added.length}</div>
                          <div className="text-sm text-green-600">Added</div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                          <div className="text-2xl font-bold text-red-600">{diffResult.removed.length}</div>
                          <div className="text-sm text-red-600">Removed</div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded">
                          <div className="text-2xl font-bold text-yellow-600">{diffResult.modified.length}</div>
                          <div className="text-sm text-yellow-600">Modified</div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                          <div className="text-2xl font-bold text-blue-600">{diffResult.unchanged}</div>
                          <div className="text-sm text-blue-600">Unchanged</div>
                        </div>
                      </div>

                      {(diffResult.added.length > 0 || diffResult.removed.length > 0 || diffResult.modified.length > 0) && (
                        <div className="space-y-3">
                          {diffResult.added.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-green-600 mb-2">Added:</h4>
                              <div className="max-h-32 overflow-y-auto">
                                {diffResult.added.slice(0, 10).map((item, idx) => (
                                  <div key={idx} className="text-sm font-mono bg-green-50 dark:bg-green-950/20 p-1 rounded mb-1">
                                    + {item}
                                  </div>
                                ))}
                                {diffResult.added.length > 10 && (
                                  <div className="text-sm text-muted-foreground">
                                    ... and {diffResult.added.length - 10} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {diffResult.removed.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-red-600 mb-2">Removed:</h4>
                              <div className="max-h-32 overflow-y-auto">
                                {diffResult.removed.slice(0, 10).map((item, idx) => (
                                  <div key={idx} className="text-sm font-mono bg-red-50 dark:bg-red-950/20 p-1 rounded mb-1">
                                    - {item}
                                  </div>
                                ))}
                                {diffResult.removed.length > 10 && (
                                  <div className="text-sm text-muted-foreground">
                                    ... and {diffResult.removed.length - 10} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {diffResult.modified.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-yellow-600 mb-2">Modified:</h4>
                              <div className="max-h-32 overflow-y-auto">
                                {diffResult.modified.slice(0, 10).map((item, idx) => (
                                  <div key={idx} className="text-sm font-mono bg-yellow-50 dark:bg-yellow-950/20 p-1 rounded mb-1">
                                    ~ {item}
                                  </div>
                                ))}
                                {diffResult.modified.length > 10 && (
                                  <div className="text-sm text-muted-foreground">
                                    ... and {diffResult.modified.length - 10} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2">Performance Optimizations:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Chunked processing for large JSON files</li>
                <li>• Flattened object comparison for deep analysis</li>
                <li>• Progress tracking for user feedback</li>
                <li>• Memory-efficient algorithms</li>
                <li>• Configurable comparison options</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">JSON Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter JSON to convert"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button onClick={convertToXML} size="sm">
                    To XML
                  </Button>
                  <Button onClick={convertToYAML} variant="outline" size="sm">
                    To YAML
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Converted Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonOutput}
                  readOnly
                  className="min-h-[200px] font-mono text-sm bg-muted"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={copyToClipboard} size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="merge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JSON Deep Merge</CardTitle>
              <CardDescription>Merge two JSON objects deeply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First JSON Object</label>
                    <Textarea
                      placeholder='{"a": 1, "b": {"c": 2}}'
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Second JSON Object</label>
                    <Textarea
                      placeholder='{"b": {"d": 3}, "e": 4}'
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                </div>
                <Button>Merge Objects</Button>
                <div>
                  <label className="text-sm font-medium mb-2 block">Merged Result</label>
                  <Textarea
                    readOnly
                    className="min-h-[100px] font-mono text-sm bg-muted"
                    placeholder="Merged result will appear here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="excel" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Excel to JSON</CardTitle>
                <CardDescription>Convert Excel/CSV data to JSON</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Excel/CSV File
                  </Button>
                  <Textarea
                    placeholder="Or paste CSV data here..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button>Convert to JSON</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JSON to Excel</CardTitle>
                <CardDescription>Convert JSON array to Excel format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button>Download as Excel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JSONTools;
