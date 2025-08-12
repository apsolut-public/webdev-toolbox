
import React, { useState } from 'react';
import { Search, Code, Palette, Calculator, FileText, Beaker, Hash, Shield, Settings, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JSONTools from '@/components/tools/JSONTools';
import HashingTools from '@/components/tools/HashingTools';
import CipherTools from '@/components/tools/CipherTools';
import EncodingTools from '@/components/tools/EncodingTools';
import DeveloperTools from '@/components/tools/DeveloperTools';
import DesignerTools from '@/components/tools/DesignerTools';
import UnitConverter from '@/components/tools/UnitConverter';
import TextTools from '@/components/tools/TextTools';
import CSSTools from '@/components/tools/CSSTools';
import LaboratoryTools from '@/components/tools/LaboratoryTools';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('text');

  const categories = [
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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderToolContent = () => {
    switch (activeCategory) {
      case 'json':
        return <JSONTools />;
      case 'hashing':
        return <HashingTools />;
      case 'encrypt':
        return <CipherTools />;
      case 'encoding':
        return <EncodingTools />;
      case 'development':
        return <DeveloperTools />;
      case 'design':
        return <DesignerTools />;
      case 'units':
        return <UnitConverter />;
      case 'text':
        return <TextTools />;
      case 'css':
        return <CSSTools />;
      case 'laboratory':
        return <LaboratoryTools />;
      default:
        return <JSONTools />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WebDev Toolkit
              </h1>
              <p className="text-muted-foreground mt-1">
                Essential tools for developers, designers, and creators
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h2 className="text-lg font-semibold mb-4">Tool Categories</h2>
              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        activeCategory === category.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category.color} text-white`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.tools.length} tools
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const category = categories.find(c => c.id === activeCategory);
                    const IconComponent = category?.icon || Code;
                    return (
                      <>
                        <div className={`p-3 rounded-lg ${category?.color || 'bg-blue-500'} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{category?.name} Tools</CardTitle>
                          <CardDescription>{category?.description}</CardDescription>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                {renderToolContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
