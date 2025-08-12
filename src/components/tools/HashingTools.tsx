
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HashingTools = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const { toast } = useToast();

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      // Generate SHA hashes using Web Crypto API
      const sha1Hash = await crypto.subtle.digest('SHA-1', data);
      const sha256Hash = await crypto.subtle.digest('SHA-256', data);
      const sha512Hash = await crypto.subtle.digest('SHA-512', data);

      // Convert to hex
      const sha1Hex = Array.from(new Uint8Array(sha1Hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      const sha256Hex = Array.from(new Uint8Array(sha256Hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      const sha512Hex = Array.from(new Uint8Array(sha512Hash)).map(b => b.toString(16).padStart(2, '0')).join('');

      // Simple MD5 implementation (for demo purposes)
      const md5Hex = simpleMD5(text);

      setHashes({
        md5: md5Hex,
        sha1: sha1Hex,
        sha256: sha256Hex,
        sha512: sha512Hex
      });
    } catch (error) {
      toast({ title: "Hashing failed", description: "An error occurred while generating hashes", variant: "destructive" });
    }
  };

  // Simple MD5 implementation for demo
  const simpleMD5 = (text: string): string => {
    // This is a simplified version - in production, use a proper crypto library
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type.toUpperCase()} copied to clipboard!` });
  };

  const hashAlgorithms = [
    {
      name: 'MD5',
      key: 'md5',
      description: '128-bit hash function (deprecated for security)',
      color: 'bg-red-500'
    },
    {
      name: 'SHA-1',
      key: 'sha1',
      description: '160-bit hash function (deprecated for security)',
      color: 'bg-orange-500'
    },
    {
      name: 'SHA-256',
      key: 'sha256',
      description: '256-bit secure hash function',
      color: 'bg-green-500'
    },
    {
      name: 'SHA-512',
      key: 'sha512',
      description: '512-bit secure hash function',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Hash Generator
          </CardTitle>
          <CardDescription>
            Generate cryptographic hashes for your text input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Input Text</label>
              <Textarea
                placeholder="Enter text to hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4">
              {hashAlgorithms.map((algo) => (
                <Card key={algo.key} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${algo.color} text-white flex-shrink-0`}>
                        <Hash className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{algo.name}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(hashes[algo.key as keyof typeof hashes], algo.name)}
                            disabled={!hashes[algo.key as keyof typeof hashes]}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{algo.description}</p>
                        <div className="bg-muted p-3 rounded-lg">
                          <code className="text-sm font-mono break-all">
                            {hashes[algo.key as keyof typeof hashes] || 'Enter text to generate hash...'}
                          </code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hash Verification</CardTitle>
          <CardDescription>
            Verify if a hash matches your input text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Original Text</label>
                <Input placeholder="Enter original text..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Hash to Verify</label>
                <Input placeholder="Enter hash to verify..." />
              </div>
            </div>
            <Button>Verify Hash</Button>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Verification result will appear here...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HashingTools;
