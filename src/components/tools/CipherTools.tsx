
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Key, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CipherTools = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('caesar');
  const { toast } = useToast();

  const caesarCipher = (text: string, shift: number, decrypt = false) => {
    const actualShift = decrypt ? -shift : shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const isUpperCase = char >= 'A' && char <= 'Z';
      const base = isUpperCase ? 65 : 97;
      const charCode = char.charCodeAt(0) - base;
      const shiftedCode = (charCode + actualShift + 26) % 26;
      return String.fromCharCode(shiftedCode + base);
    });
  };

  const vigenereCipher = (text: string, key: string, decrypt = false) => {
    if (!key) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (/[a-zA-Z]/.test(char)) {
        const isUpperCase = char >= 'A' && char <= 'Z';
        const charCode = char.charCodeAt(0) - (isUpperCase ? 65 : 97);
        const keyChar = key[keyIndex % key.length].toUpperCase();
        const keyCode = keyChar.charCodeAt(0) - 65;
        
        const shift = decrypt ? -keyCode : keyCode;
        const shiftedCode = (charCode + shift + 26) % 26;
        
        result += String.fromCharCode(shiftedCode + (isUpperCase ? 65 : 97));
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };

  const base64Encode = (text: string) => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      return 'Error encoding';
    }
  };

  const base64Decode = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      return 'Error decoding';
    }
  };

  const processText = () => {
    if (!plaintext && mode === 'encrypt') {
      toast({ title: "No input", description: "Please enter text to encrypt", variant: "destructive" });
      return;
    }
    
    if (!ciphertext && mode === 'decrypt') {
      toast({ title: "No input", description: "Please enter text to decrypt", variant: "destructive" });
      return;
    }

    let result = '';
    const inputText = mode === 'encrypt' ? plaintext : ciphertext;

    try {
      switch (algorithm) {
        case 'caesar': {
          const shift = parseInt(key) || 3;
          result = caesarCipher(inputText, shift, mode === 'decrypt');
          break;
        }
        case 'vigenere':
          if (!key) {
            toast({ title: "Key required", description: "Vigenère cipher requires a key", variant: "destructive" });
            return;
          }
          result = vigenereCipher(inputText, key, mode === 'decrypt');
          break;
        case 'base64':
          result = mode === 'encrypt' ? base64Encode(inputText) : base64Decode(inputText);
          break;
        case 'rot13':
          result = caesarCipher(inputText, 13, false); // ROT13 is its own inverse
          break;
        default:
          result = inputText;
      }

      if (mode === 'encrypt') {
        setCiphertext(result);
      } else {
        setPlaintext(result);
      }

      toast({ title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} successful!` });
    } catch (error) {
      toast({ title: "Operation failed", description: "An error occurred during processing", variant: "destructive" });
    }
  };

  const algorithms = [
    { value: 'caesar', label: 'Caesar Cipher', description: 'Simple shift cipher' },
    { value: 'vigenere', label: 'Vigenère Cipher', description: 'Polyalphabetic cipher' },
    { value: 'base64', label: 'Base64', description: 'Encoding (not encryption)' },
    { value: 'rot13', label: 'ROT13', description: 'Simple letter substitution' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cipher Tools
          </CardTitle>
          <CardDescription>
            Encrypt and decrypt text using various cipher algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Algorithm Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Algorithm</label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Mode</label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encrypt">Encrypt</SelectItem>
                    <SelectItem value="decrypt">Decrypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {algorithm === 'caesar' ? 'Shift Value' : 'Key'}
                </label>
                <Input
                  placeholder={algorithm === 'caesar' ? '3' : algorithm === 'base64' ? 'Not required' : 'Enter key...'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  disabled={algorithm === 'base64' || algorithm === 'rot13'}
                />
              </div>
            </div>

            {/* Selected Algorithm Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  <span className="font-medium">
                    {algorithms.find(a => a.value === algorithm)?.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {algorithms.find(a => a.value === algorithm)?.description}
                </p>
              </CardContent>
            </Card>

            {/* Input/Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Plaintext
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter text to encrypt..."
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="min-h-[200px] font-mono"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Ciphertext
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Encrypted text will appear here..."
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    className="min-h-[200px] font-mono"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={processText} className="px-8">
                {mode === 'encrypt' ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Encrypt
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Decrypt
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cipher Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Cipher Reference</CardTitle>
          <CardDescription>Quick reference for cipher algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithms.map((algo) => (
              <Card key={algo.value} className="p-4">
                <h4 className="font-semibold mb-2">{algo.label}</h4>
                <p className="text-sm text-muted-foreground mb-2">{algo.description}</p>
                <div className="text-xs text-muted-foreground">
                  {algo.value === 'caesar' && "Shifts each letter by a fixed number of positions"}
                  {algo.value === 'vigenere' && "Uses a keyword to shift letters by varying amounts"}
                  {algo.value === 'base64' && "Encodes binary data in ASCII string format"}
                  {algo.value === 'rot13' && "Special case of Caesar cipher with shift of 13"}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CipherTools;
