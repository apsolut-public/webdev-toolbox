import { FileText, Code, Hash, Shield, Settings, Palette, Calculator, Beaker } from 'lucide-react';

export const categories = [
  {
    id: 'text',
    name: 'Text',
    icon: FileText,
    description: 'Text processing and formatting tools',
    color: 'bg-teal-500',
    tools: ['Case Converter', 'Find & Replace', 'Line Sorter', 'Text Analysis']
  },
  {
    id: 'css',
    name: 'CSS',
    icon: Code,
    description: 'CSS and HTML formatting, minification, and conversion tools',
    color: 'bg-emerald-500',
    tools: ['CSS Formatter', 'CSS Minifier', 'CSS to Inline', 'HTML Formatter', 'CSS Validator']
  },
  {
    id: 'json',
    name: 'JSON',
    icon: Code,
    description: 'JSON manipulation and conversion tools',
    color: 'bg-blue-500',
    tools: ['JSON Formatting', 'JSON Merge', 'Excel ↔ JSON', 'XML ↔ JSON', 'YAML ↔ JSON']
  },
  {
    id: 'hashing',
    name: 'Hashing',
    icon: Hash,
    description: 'Hash algorithms and generators',
    color: 'bg-green-500',
    tools: ['MD5', 'SHA1', 'SHA256', 'SHA512', 'RIPEMD-160']
  },
  {
    id: 'encrypt',
    name: 'Encrypt',
    icon: Shield,
    description: 'Encryption and cipher tools',
    color: 'bg-purple-500',
    tools: ['AES', 'DES/TripleDES', 'RC4', 'Rabbit']
  },
  {
    id: 'encoding',
    name: 'Encoding',
    icon: FileText,
    description: 'Data encoding and decoding',
    color: 'bg-orange-500',
    tools: ['Base64', 'Base32', 'URL Encoding', 'Unicode', 'Hex']
  },
  {
    id: 'development',
    name: 'Development',
    icon: Settings,
    description: 'Developer utilities and tools',
    color: 'bg-cyan-500',
    tools: ['URL Parser', 'Timestamp Converter', 'Base Conversion', 'JWT Decode']
  },
  {
    id: 'design',
    name: 'Design',
    icon: Palette,
    description: 'Design and visual tools',
    color: 'bg-pink-500',
    tools: ['Color Converter', 'Color Reversal', 'Image Compression', 'Extract Colors']
  },
  {
    id: 'units',
    name: 'Units',
    icon: Calculator,
    description: 'Unit conversion utilities',
    color: 'bg-indigo-500',
    tools: ['Length', 'Area', 'Volume', 'Mass', 'Temperature', 'Speed']
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    icon: Beaker,
    description: 'Experimental and utility tools',
    color: 'bg-red-500',
    tools: ['Energy Restorer', 'Stock Calculator', 'Short Link Generator']
  }
];
