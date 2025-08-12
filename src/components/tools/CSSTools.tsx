import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Palette, Minimize, FileCode, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CSSTools = () => {
  const [cssText, setCssText] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied to clipboard!" });
  };

  // CSS Formatter
  const formatCSS = () => {
    try {
      const formatted = cssText
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments for formatting
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      setResult(formatted);
      toast({ title: "CSS formatted successfully!" });
    } catch (error) {
      toast({ title: "CSS formatting failed", variant: "destructive" });
    }
  };

  // CSS Minifier
  const minifyCSS = () => {
    try {
      const minified = cssText
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/;\s*}/g, '}') // Remove last semicolon before }
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .replace(/\s*}\s*/g, '}')
        .replace(/,\s*/g, ',')
        .replace(/:\s*/g, ':')
        .trim();
      
      setResult(minified);
      toast({ title: "CSS minified successfully!" });
    } catch (error) {
      toast({ title: "CSS minification failed", variant: "destructive" });
    }
  };

  // CSS to Inline Styles
  const cssToInline = () => {
    try {
      // Simple CSS to inline converter (basic implementation)
      const rules = cssText.match(/([^{]+)\{([^}]+)\}/g) || [];
      let inline = '';
      
      rules.forEach(rule => {
        const [selector, styles] = rule.split('{');
        const cleanStyles = styles.replace('}', '').trim();
        inline += `<!-- ${selector.trim()} -->\nstyle="${cleanStyles}"\n\n`;
      });
      
      setResult(inline);
      toast({ title: "CSS converted to inline styles!" });
    } catch (error) {
      toast({ title: "Conversion failed", variant: "destructive" });
    }
  };

  // CSS Beautifier with better formatting
  const beautifyCSS = () => {
    try {
      let formatted = cssText
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Add proper indentation and line breaks
      formatted = formatted
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n\n')
        .replace(/,\s*(?![^()]*\))/g, ',\n')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      setResult(formatted);
      toast({ title: "CSS beautified successfully!" });
    } catch (error) {
      toast({ title: "CSS beautification failed", variant: "destructive" });
    }
  };

  // CSS Validator (basic)
  const validateCSS = () => {
    try {
      const issues = [];
      const lines = cssText.split('\n');
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('/*') && !trimmed.endsWith('*/')) {
          // Check for missing semicolons
          if (trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
            issues.push(`Line ${index + 1}: Missing semicolon`);
          }
          // Check for unmatched braces
          const openBraces = (trimmed.match(/{/g) || []).length;
          const closeBraces = (trimmed.match(/}/g) || []).length;
          if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
            issues.push(`Line ${index + 1}: Unmatched braces`);
          }
        }
      });

      if (issues.length === 0) {
        setResult("✅ No obvious CSS syntax issues found!");
      } else {
        setResult("⚠️ Potential issues found:\n\n" + issues.join('\n'));
      }
      toast({ title: "CSS validation complete!" });
    } catch (error) {
      toast({ title: "CSS validation failed", variant: "destructive" });
    }
  };

  // HTML Formatter
  const formatHTML = () => {
    try {
      const lines = htmlText
        .replace(/>\s*</g, '><') // Remove spaces between tags
        .replace(/</g, '\n<') // Add line breaks before tags
        .split('\n')
        .filter(line => line.trim().length > 0);

      let indent = 0;
      const formattedLines = lines
        .map(line => {
          const trimmed = line.trim();
          
          if (trimmed.match(/^<\/[^>]+>$/)) indent--;
          
          const result = '  '.repeat(Math.max(0, indent)) + trimmed;
          
          if (trimmed.match(/^<[^\/][^>]*[^\/]>$/)) indent++;
          
          return result;
        })
        .join('\n');
      
      setResult(formattedLines);
      toast({ title: "HTML formatted successfully!" });
    } catch (error) {
      toast({ title: "HTML formatting failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="format">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="minify">Minify</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="validate">Validate</TabsTrigger>
        </TabsList>

        <TabsContent value="format" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                CSS & HTML Formatter
              </CardTitle>
              <CardDescription>Format and beautify CSS and HTML code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">CSS Input</label>
                  <Textarea
                    placeholder="Enter CSS code to format..."
                    value={cssText}
                    onChange={(e) => setCssText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Button onClick={formatCSS} variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-1" />
                      Format CSS
                    </Button>
                    <Button onClick={beautifyCSS} variant="outline" size="sm">
                      <Wand2 className="h-4 w-4 mr-1" />
                      Beautify CSS
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">HTML Input</label>
                  <Textarea
                    placeholder="Enter HTML code to format..."
                    value={htmlText}
                    onChange={(e) => setHtmlText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button onClick={formatHTML} variant="outline" size="sm">
                      <FileCode className="h-4 w-4 mr-1" />
                      Format HTML
                    </Button>
                  </div>
                </div>
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Formatted Result</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[200px] bg-muted font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minimize className="h-5 w-5" />
                CSS Minifier
              </CardTitle>
              <CardDescription>Compress CSS code for production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">CSS Input</label>
                <Textarea
                  placeholder="Enter CSS code to minify..."
                  value={cssText}
                  onChange={(e) => setCssText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <Button onClick={minifyCSS} className="w-full">
                <Minimize className="h-4 w-4 mr-2" />
                Minify CSS
              </Button>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Minified CSS</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[200px] bg-muted font-mono text-sm"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    Original: {cssText.length} characters → Minified: {result.length} characters 
                    ({Math.round(((cssText.length - result.length) / cssText.length) * 100)}% reduction)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                CSS Converter
              </CardTitle>
              <CardDescription>Convert CSS to different formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">CSS Input</label>
                <Textarea
                  placeholder="Enter CSS rules to convert..."
                  value={cssText}
                  onChange={(e) => setCssText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <Button onClick={cssToInline} className="w-full">
                <Code className="h-4 w-4 mr-2" />
                Convert to Inline Styles
              </Button>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Inline Styles</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[200px] bg-muted font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                CSS Validator
              </CardTitle>
              <CardDescription>Check CSS syntax and find potential issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">CSS Input</label>
                <Textarea
                  placeholder="Enter CSS code to validate..."
                  value={cssText}
                  onChange={(e) => setCssText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <Button onClick={validateCSS} className="w-full">
                <FileCode className="h-4 w-4 mr-2" />
                Validate CSS
              </Button>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Validation Results</label>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[200px] bg-muted font-mono text-sm"
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

export default CSSTools;
