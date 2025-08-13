
import React, { useState, useMemo } from 'react';
import { Search, Code, Palette, Calculator, FileText, Beaker, Hash, Shield, Settings, ChevronRight, Heart } from 'lucide-react';
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
import { categories } from '@/lib/categories';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('text');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toolContent = useMemo(() => {
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
  }, [activeCategory]);

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
                {toolContent}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t">
        <a 
          href="https://apsolut.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          Created with <Heart className="w-4 h-4 text-red-500 fill-current" /> by AP
        </a>
      </footer>
    </div>
  );
};

export default Index;
