
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calculator, Ruler, Thermometer, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Unit {
  name: string;
  factor: number;
}

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [activeCategory, setActiveCategory] = useState('length');
  const { toast } = useToast();

  const unitCategories = {
    length: {
      name: 'Length',
      icon: Ruler,
      units: [
        { name: 'Millimeter', factor: 0.001 },
        { name: 'Centimeter', factor: 0.01 },
        { name: 'Meter', factor: 1 },
        { name: 'Kilometer', factor: 1000 },
        { name: 'Inch', factor: 0.0254 },
        { name: 'Foot', factor: 0.3048 },
        { name: 'Yard', factor: 0.9144 },
        { name: 'Mile', factor: 1609.344 },
      ] as Unit[]
    },
    area: {
      name: 'Area',
      icon: Calculator,
      units: [
        { name: 'Square Millimeter', factor: 0.000001 },
        { name: 'Square Centimeter', factor: 0.0001 },
        { name: 'Square Meter', factor: 1 },
        { name: 'Square Kilometer', factor: 1000000 },
        { name: 'Square Inch', factor: 0.00064516 },
        { name: 'Square Foot', factor: 0.092903 },
        { name: 'Acre', factor: 4046.86 },
        { name: 'Hectare', factor: 10000 },
      ] as Unit[]
    },
    volume: {
      name: 'Volume',
      icon: Calculator,
      units: [
        { name: 'Milliliter', factor: 0.001 },
        { name: 'Liter', factor: 1 },
        { name: 'Cubic Meter', factor: 1000 },
        { name: 'Fluid Ounce (US)', factor: 0.0295735 },
        { name: 'Cup (US)', factor: 0.236588 },
        { name: 'Pint (US)', factor: 0.473176 },
        { name: 'Quart (US)', factor: 0.946353 },
        { name: 'Gallon (US)', factor: 3.78541 },
      ] as Unit[]
    },
    mass: {
      name: 'Mass',
      icon: Calculator,
      units: [
        { name: 'Milligram', factor: 0.000001 },
        { name: 'Gram', factor: 0.001 },
        { name: 'Kilogram', factor: 1 },
        { name: 'Metric Ton', factor: 1000 },
        { name: 'Ounce', factor: 0.0283495 },
        { name: 'Pound', factor: 0.453592 },
        { name: 'Stone', factor: 6.35029 },
        { name: 'US Ton', factor: 907.185 },
      ] as Unit[]
    },
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      units: [
        { name: 'Celsius', factor: 1 },
        { name: 'Fahrenheit', factor: 1 },
        { name: 'Kelvin', factor: 1 },
        { name: 'Rankine', factor: 1 },
      ] as Unit[]
    },
    speed: {
      name: 'Speed',
      icon: Zap,
      units: [
        { name: 'Meter/Second', factor: 1 },
        { name: 'Kilometer/Hour', factor: 0.277778 },
        { name: 'Mile/Hour', factor: 0.44704 },
        { name: 'Foot/Second', factor: 0.3048 },
        { name: 'Knot', factor: 0.514444 },
      ] as Unit[]
    }
  };

  const convertValue = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      toast({ title: "Invalid input", description: "Please enter a valid number", variant: "destructive" });
      return;
    }

    const category = unitCategories[activeCategory as keyof typeof unitCategories];
    const fromUnitObj = category.units.find((u: Unit) => u.name === fromUnit);
    const toUnitObj = category.units.find((u: Unit) => u.name === toUnit);

    if (!fromUnitObj || !toUnitObj) {
      toast({ title: "Unit not selected", description: "Please select both units", variant: "destructive" });
      return;
    }

    let result: number;

    if (activeCategory === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      const baseValue = value * fromUnitObj.factor;
      result = baseValue / toUnitObj.factor;
    }

    setOutputValue(result.toFixed(6));
    toast({ title: "Conversion completed!" });
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;

    switch (from) {
      case 'Celsius':
        celsius = value;
        break;
      case 'Fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'Kelvin':
        celsius = value - 273.15;
        break;
      case 'Rankine':
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }

    switch (to) {
      case 'Celsius':
        return celsius;
      case 'Fahrenheit':
        return celsius * 9/5 + 32;
      case 'Kelvin':
        return celsius + 273.15;
      case 'Rankine':
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  };

  const currentCategory = unitCategories[activeCategory as keyof typeof unitCategories];

  return (
    <div className="space-y-6">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {Object.entries(unitCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(unitCategories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name} Converter
                </CardTitle>
                <CardDescription>Convert between different {category.name.toLowerCase()} units</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.units.map((unit: Unit) => (
                          <SelectItem key={unit.name} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.units.map((unit: Unit) => (
                          <SelectItem key={unit.name} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Result"
                      value={outputValue}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Button onClick={convertValue} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Convert
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UnitConverter;
