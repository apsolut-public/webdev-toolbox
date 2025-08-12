
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Type, Search, ArrowUpDown, Copy, Shuffle, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextTools = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied to clipboard!" });
  };

  // Case Conversion Functions
  const convertCase = (type: string) => {
    let converted = '';
    
    switch (type) {
      case 'upper':
        converted = text.toUpperCase();
        break;
      case 'lower':
        converted = text.toLowerCase();
        break;
      case 'title':
        converted = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        converted = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        converted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'pascal':
        converted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
        break;
      case 'snake':
        converted = text.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        converted = text.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        converted = text;
    }
    
    setResult(converted);
    toast({ title: "Text converted successfully!" });
  };

  // Text Replacement
  const bulkReplace = () => {
    if (!searchText) {
      toast({ title: "No search text", description: "Please enter text to search for", variant: "destructive" });
      return;
    }
    
    const replaced = text.replace(new RegExp(searchText, 'g'), replaceText);
    setResult(replaced);
    toast({ title: "Text replaced successfully!" });
  };

  // Remove Line Breaks
  const removeLineBreaks = () => {
    const cleaned = text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
    setResult(cleaned);
    toast({ title: "Line breaks removed!" });
  };

  // Sort Lines
  const sortLines = () => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sorted = lines.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    setResult(sorted.join('\n'));
    toast({ title: "Lines sorted successfully!" });
  };

  // Remove Duplicates
  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    setResult(unique.join('\n'));
    toast({ title: "Duplicate lines removed!" });
  };

  // Text Statistics
  const getTextStats = () => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    return { chars, charsNoSpaces, words, lines, paragraphs };
  };

  // Extract Keywords (simple implementation)
  const extractKeywords = () => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    const keywords = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => `${word} (${count})`)
      .join('\n');
    
    setResult(keywords);
    toast({ title: "Keywords extracted!" });
  };

  const stats = getTextStats();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="case">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="case">Case</TabsTrigger>
          <TabsTrigger value="replace">Replace</TabsTrigger>
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="sort">Sort</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
        </TabsList>

        <TabsContent value="case" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Case Converter
              </CardTitle>
              <CardDescription>Convert text to different case formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Text</label>
                <Textarea
                  placeholder="Enter text to convert..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button onClick={() => convertCase('upper')} variant="outline" size="sm">
                  UPPERCASE
                </Button>
                <Button onClick={() => convertCase('lower')} variant="outline" size="sm">
                  lowercase
                </Button>
                <Button onClick={() => convertCase('title')} variant="outline" size="sm">
                  Title Case
                </Button>
                <Button onClick={() => convertCase('sentence')} variant="outline" size="sm">
                  Sentence case
                </Button>
                <Button onClick={() => convertCase('camel')} variant="outline" size="sm">
                  camelCase
                </Button>
                <Button onClick={() => convertCase('pascal')} variant="outline" size="sm">
                  PascalCase
                </Button>
                <Button onClick={() => convertCase('snake')} variant="outline" size="sm">
                  snake_case
                </Button>
                <Button onClick={() => convertCase('kebab')} variant="outline" size="sm">
                  kebab-case
                </Button>
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Result</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[150px] bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Bulk Text Replacement
              </CardTitle>
              <CardDescription>Find and replace text in bulk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Text</label>
                <Textarea
                  placeholder="Enter text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Find</label>
                  <Input
                    placeholder="Text to find..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Replace with</label>
                  <Input
                    placeholder="Replacement text..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={bulkReplace} className="w-full">
                Replace All
              </Button>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Result</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[150px] bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="format" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text Formatting
              </CardTitle>
              <CardDescription>Format and clean up text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Text</label>
                <Textarea
                  placeholder="Enter text to format..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={removeLineBreaks} variant="outline">
                  Remove Line Breaks
                </Button>
                <Button onClick={removeDuplicates} variant="outline">
                  Remove Duplicates
                </Button>
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Result</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[150px] bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sort" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Line Sorter
              </CardTitle>
              <CardDescription>Sort lines alphabetically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Text (one item per line)</label>
                <Textarea
                  placeholder="Enter lines to sort..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">A to Z</SelectItem>
                    <SelectItem value="desc">Z to A</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={sortLines}>
                  Sort Lines
                </Button>
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Sorted Result</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[150px] bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Text Analysis
              </CardTitle>
              <CardDescription>Analyze text and extract information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Text</label>
                <Textarea
                  placeholder="Enter text to analyze..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold">{stats.chars}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">{stats.charsNoSpaces}</div>
                  <div className="text-sm text-muted-foreground">No Spaces</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">{stats.lines}</div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">{stats.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                </Card>
              </div>

              <Button onClick={extractKeywords} variant="outline">
                Extract Keywords
              </Button>

              {result && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Top Keywords</label>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[150px] bg-muted"
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

export default TextTools;
