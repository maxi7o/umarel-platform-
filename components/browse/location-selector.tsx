'use client';

import { useState } from 'react';
import { MapPin, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface LocationSelectorProps {
    currentLocation?: string;
    onLocationChange: (location: string) => void;
    className?: string;
}

const POPULAR_LOCATIONS = [
    'Buenos Aires, Argentina',
    'Córdoba, Argentina',
    'Rosario, Argentina',
    'Mendoza, Argentina',
    'La Plata, Argentina',
    'Mar del Plata, Argentina',
    'San Miguel de Tucumán, Argentina',
    'Salta, Argentina',
];

export function LocationSelector({
    currentLocation = '',
    onLocationChange,
    className = ''
}: LocationSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectLocation = (location: string) => {
        onLocationChange(location);
        setOpen(false);
        setSearchQuery('');
    };

    const filteredLocations = POPULAR_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`gap-2 ${className}`}
                    size="lg"
                >
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {currentLocation || 'Select Location'}
                    </span>
                    <span className="sm:hidden">
                        {currentLocation ? currentLocation.split(',')[0] : 'Location'}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="p-2">
                    <div className="mb-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Popular Locations
                    </div>
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((location) => (
                            <button
                                key={location}
                                onClick={() => handleSelectLocation(location)}
                                className="w-full text-left px-2 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                            >
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{location}</span>
                            </button>
                        ))
                    ) : (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                            No locations found
                        </div>
                    )}

                    <div className="mt-2 pt-2 border-t">
                        <button
                            onClick={() => handleSelectLocation('Virtual')}
                            className="w-full text-left px-2 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                        >
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span>Virtual Services Only</span>
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
