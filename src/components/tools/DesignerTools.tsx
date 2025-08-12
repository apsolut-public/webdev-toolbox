
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Eye, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DesignerTools = () => {
  const [color, setColor] = useState('#3b82f6');
  const [convertedColors, setConvertedColors] = useState<any>({});
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const convertColor = () => {
    const rgb = hexToRgb(color);
    if (!rgb) {
      toast({ title: "Invalid color", description: "Please enter a valid hex color", variant: "destructive" });
      return;
    }

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    setConvertedColors({
      hex: color.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`
    });

    toast({ title: "Color converted successfully!" });
  };

  const generatePalette = (baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [];

    // Generate lighter and darker variants
    for (let i = -4; i <= 4; i++) {
      const lightness = Math.max(5, Math.min(95, hsl.l + (i * 10)));
      const newHsl = { ...hsl, l: lightness };
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      palette.push(newHex);
    }

    return palette;
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const invertColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const inverted = {
      r: 255 - rgb.r,
      g: 255 - rgb.g,
      b: 255 - rgb.b
    };
    
    return rgbToHex(inverted.r, inverted.g, inverted.b);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const palette = generatePalette(color);
  const invertedColor = invertColor(color);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="converter">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="converter">Color Converter</TabsTrigger>
          <TabsTrigger value="palette">Color Palette</TabsTrigger>
          <TabsTrigger value="invert">Color Invert</TabsTrigger>
          <TabsTrigger value="tools">Image Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="converter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Format Converter
              </CardTitle>
              <CardDescription>Convert colors between different formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Color Input</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      placeholder="#3b82f6"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={convertColor}>
                      Convert
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color Preview</label>
                  <div
                    className="w-full h-20 rounded-lg border"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>

              {Object.keys(convertedColors).length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Converted Formats</h3>
                  {Object.entries(convertedColors).map(([format, value]) => (
                    <div key={format} className="flex items-center gap-2">
                      <div className="w-16 text-sm font-medium uppercase">{format}:</div>
                      <Input
                        value={value as string}
                        readOnly
                        className="flex-1 font-mono text-sm bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(value as string)}
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="palette" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette Generator</CardTitle>
              <CardDescription>Generate color variations and palettes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  placeholder="#3b82f6"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Lightness Variations</h3>
                <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                  {palette.map((paletteColor, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className="w-full h-16 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: paletteColor }}
                        onClick={() => copyToClipboard(paletteColor)}
                        title={`Click to copy: ${paletteColor}`}
                      />
                      <p className="text-xs font-mono text-center">{paletteColor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Inverter</CardTitle>
              <CardDescription>Generate inverted and complementary colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  placeholder="#3b82f6"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4 space-y-2">
                    <h4 className="font-semibold">Original Color</h4>
                    <div
                      className="w-full h-24 rounded-lg border cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`Click to copy: ${color}`}
                    />
                    <p className="text-sm font-mono text-center">{color}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 space-y-2">
                    <h4 className="font-semibold">Inverted Color</h4>
                    <div
                      className="w-full h-24 rounded-lg border cursor-pointer"
                      style={{ backgroundColor: invertedColor }}
                      onClick={() => copyToClipboard(invertedColor)}
                      title={`Click to copy: ${invertedColor}`}
                    />
                    <p className="text-sm font-mono text-center">{invertedColor}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Image Color Extractor</CardTitle>
                <CardDescription>Extract dominant colors from images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Upload an image to extract its color palette
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Compression</CardTitle>
                <CardDescription>Compress and optimize images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality: 80%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    defaultValue="80"
                    className="w-full"
                  />
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignerTools;
