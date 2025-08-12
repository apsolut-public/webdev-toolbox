
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, FileText, Code, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EncodingTools = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('base64');
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  // Base64 encoding/decoding
  const base64Encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      toast({ title: "Base64 encoded successfully!" });
    } catch (error) {
      toast({ title: "Encoding failed", variant: "destructive" });
    }
  };

  const base64Decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      toast({ title: "Base64 decoded successfully!" });
    } catch (error) {
      toast({ title: "Decoding failed", variant: "destructive" });
    }
  };

  // URL encoding/decoding
  const urlEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast({ title: "URL encoded successfully!" });
    } catch (error) {
      toast({ title: "Encoding failed", variant: "destructive" });
    }
  };

  const urlDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast({ title: "URL decoded successfully!" });
    } catch (error) {
      toast({ title: "Decoding failed", variant: "destructive" });
    }
  };

  // HTML encoding/decoding
  const htmlEncode = () => {
    const encoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    setOutput(encoded);
    toast({ title: "HTML encoded successfully!" });
  };

  const htmlDecode = () => {
    const decoded = input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    setOutput(decoded);
    toast({ title: "HTML decoded successfully!" });
  };

  // Hex encoding/decoding
  const hexEncode = () => {
    const encoded = Array.from(new TextEncoder().encode(input))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setOutput(encoded);
    toast({ title: "Hex encoded successfully!" });
  };

  const hexDecode = () => {
    try {
      const hex = input.replace(/\s/g, '');
      const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      const decoded = new TextDecoder().decode(bytes);
      setOutput(decoded);
      toast({ title: "Hex decoded successfully!" });
    } catch (error) {
      toast({ title: "Decoding failed", variant: "destructive" });
    }
  };

  // Unicode encoding/decoding
  const unicodeEncode = () => {
    const encoded = Array.from(input)
      .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
      .join('');
    setOutput(encoded);
    toast({ title: "Unicode encoded successfully!" });
  };

  const unicodeDecode = () => {
    try {
      const decoded = input.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
      setOutput(decoded);
      toast({ title: "Unicode decoded successfully!" });
    } catch (error) {
      toast({ title: "Decoding failed", variant: "destructive" });
    }
  };

  // Base32 encoding (simplified)
  const base32Encode = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes = new TextEncoder().encode(input);
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;

      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }

    setOutput(result);
    toast({ title: "Base32 encoded successfully!" });
  };

  const renderEncodingTab = (
    title: string,
    encodeFunc: () => void,
    decodeFunc: () => void,
    icon: React.ReactNode,
    description: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Input</label>
          <Textarea
            placeholder="Enter text to encode/decode..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={encodeFunc} className="flex-1">
            Encode
          </Button>
          <Button onClick={decodeFunc} variant="outline" className="flex-1">
            Decode
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Output</label>
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              className="min-h-[150px] font-mono text-sm bg-muted"
              placeholder="Encoded/decoded result will appear here..."
            />
            {output && (
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="base32">Base32</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="hex">Hex</TabsTrigger>
          <TabsTrigger value="unicode">Unicode</TabsTrigger>
        </TabsList>

        <TabsContent value="base64">
          {renderEncodingTab(
            'Base64 Encoding',
            base64Encode,
            base64Decode,
            <Code className="h-5 w-5" />,
            'Encode/decode text using Base64 encoding'
          )}
        </TabsContent>

        <TabsContent value="base32">
          {renderEncodingTab(
            'Base32 Encoding',
            base32Encode,
            () => toast({ title: "Base32 decode not implemented in this demo" }),
            <Hash className="h-5 w-5" />,
            'Encode text using Base32 encoding'
          )}
        </TabsContent>

        <TabsContent value="url">
          {renderEncodingTab(
            'URL Encoding',
            urlEncode,
            urlDecode,
            <FileText className="h-5 w-5" />,
            'Encode/decode URLs and query parameters'
          )}
        </TabsContent>

        <TabsContent value="html">
          {renderEncodingTab(
            'HTML Encoding',
            htmlEncode,
            htmlDecode,
            <Code className="h-5 w-5" />,
            'Encode/decode HTML entities and special characters'
          )}
        </TabsContent>

        <TabsContent value="hex">
          {renderEncodingTab(
            'Hexadecimal Encoding',
            hexEncode,
            hexDecode,
            <Hash className="h-5 w-5" />,
            'Convert text to/from hexadecimal representation'
          )}
        </TabsContent>

        <TabsContent value="unicode">
          {renderEncodingTab(
            'Unicode Encoding',
            unicodeEncode,
            unicodeDecode,
            <FileText className="h-5 w-5" />,
            'Encode/decode Unicode escape sequences'
          )}
        </TabsContent>
      </Tabs>

      {/* Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle>Encoding Reference</CardTitle>
          <CardDescription>Common use cases for different encoding types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Base64</h4>
              <p className="text-sm text-muted-foreground">
                Binary data, email attachments, data URLs
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">URL Encoding</h4>
              <p className="text-sm text-muted-foreground">
                Query parameters, form data, special characters in URLs
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">HTML Encoding</h4>
              <p className="text-sm text-muted-foreground">
                Displaying HTML code, preventing XSS attacks
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Hexadecimal</h4>
              <p className="text-sm text-muted-foreground">
                Color codes, binary data representation, debugging
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Unicode</h4>
              <p className="text-sm text-muted-foreground">
                Internationalization, special characters, JSON strings
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Base32</h4>
              <p className="text-sm text-muted-foreground">
                Case-insensitive encoding, human-readable identifiers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncodingTools;
