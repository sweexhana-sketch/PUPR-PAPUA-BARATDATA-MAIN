
import React from 'react';
import { GisLayer } from '@/config/gis_layers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface LayerControlProps {
    layers: GisLayer[];
    onToggleLayer: (id: string) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({ layers, onToggleLayer }) => {
    return (
        <Card className="w-full md:w-64 bg-white/90 backdrop-blur-sm shadow-lg absolute top-4 right-4 z-[1000]">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Layer Control</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={layer.id}
                            checked={layer.visible}
                            onCheckedChange={() => onToggleLayer(layer.id)}
                        />
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                            <Label
                                htmlFor={layer.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {layer.name}
                            </Label>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
